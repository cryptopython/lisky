# Testing Lisky

Tests are an incredibly important component of the Lisky project and all pull requests must have strong tests with complete coverage to be accepted. We encourage the practice of test-driven development to make meaningful, complete test suites an integral aspect of development rather than an afterthought.

In Lisky we’re using BDD-style (behaviour-driven development) tests, dividing tests into two components:

1. _Executable specifications_ which consist of a series of nested but atomic steps.
1. _Step definitions_ for each of those steps.

Specifications can be found in `test/specs` and step definitions in modules in `test/steps`. There is generally a one-to-one correspondence between specification files and source files, but step definitions may be reused in various places.

This document provides guidelines for contributing such tests.

## Specifications

A specification consists of a suite of nested steps. Specifications should be written using language which is neutral with regard to test implementation. Here’s an abridged example from `test/specs/utils/cryptography.js`:

```js
import { setUpCommandCreateAccount } from '../../steps/setup';
import * as given from '../../steps/1_given';
import * as when from '../../steps/2_when';
import * as then from '../../steps/3_then';

describe('create account command', () => {
	beforeEach(setUpCommandCreateAccount);
	Given('a crypto instance', given.aCryptoInstance, () => {
		Given(
			'a passphrase "minute omit local rare sword knee banner pair rib museum shadow juice" with private key "314852d7afb0d4c283692fef8a2cb40e30c7a5df2ed79994178c10ac168d6d977ef45cd525e95b7a86244bbd4eb4550914ad06301013958f4dd64d32ef7bc588" and public key "7ef45cd525e95b7a86244bbd4eb4550914ad06301013958f4dd64d32ef7bc588" and address "2167422481642255385L"',
			given.aPassphraseWithPrivateKeyAndPublicKeyAndAddress,
			() => {
				Given(
					'the passphrase is generated by the createMnemonicPassphrase function',
					given.thePassphraseIsGeneratedByTheCreateMnemonicPassphraseFunction,
					() => {
						Given('an action "create account"', given.anAction, () => {
							When('the action is called', when.theActionIsCalled, () => {
								Then(
									'it should resolve to an object with the passphrase and the publicKey and the address',
									then.itShouldResolveToAnObjectWithThePassphraseAndThePublicKeyAndTheAddress,
								);
							});
						});
					},
				);
			},
		);
	});
});
```

For anyone who’s used Gherkin syntax (e.g. for end-to-end testing of web applications), this should seem somewhat familiar, although the step descriptions are wrapped in Mocha’s `describe` and `it` functions. There are three types of step here:

1. **Given**: for setting up the context for the test
1. **When**: for executing the code under test
1. **Then**: for making assertions against the result

The `Given` and `When` functions are just wrapped versions of Mocha’s `describe`: the description is prepended with the corresponding prefix, and the function passed immediately after the description is passed to the `beforeEach` hook for that suite. `Then` is just Mocha’s `it` with a prefixed description. These functions are globals when running tests, so you don’t need to worry about importing them.

As you can see, there is no indication here as to how the test code should be written, and the test descriptions are written in ordinary English as far as possible (bearing in mind that this is a specification of a relatively low-level function so some degree of technical language is inevitable).

In contrast to Gherkin and standard end-to-end tests, suites in Mocha can be easily nested, so appropriate organisation of your specification files can reduce verbosity and highlight relationships between the various components being specified.

The test descriptions should specify examples of any variables (e.g. `the crypto instance should have name "Crypto"`) that may be relevant so that anyone reading the specification can see what a realistic example is and can easily tell when the example diverges from real-life requirements. A corresponding step definition is then passed via a `beforeEach` hook in the case of a suite, or directly to the test in the case of a `Then` step. The step definition function name should match the description exactly, but with the specific details removed. `beforeEach` is used to ensure the tests are atomic and isolated from each other.

Notice also the use of ES6 arrow functions in specification files.

## Set-up

If your tests need any kind of set-up, it should have its own dedicated set-up function passed to the `beforeEach` hook of the outer `describe` block. Examples of things to include in such a function:

* Stubbing dependencies (but not necessarily specifying what those stubs return).
* Storing environmental variables so they can be reset after the tests.

## Step definitions

A step definition converts a step from a specification into a concrete implementation that will enforce the specification. Here are some abridged examples relating to the above specification:

```js
// test/steps/.../1_given.js

export function aPassphraseWithPrivateKeyAndPublicKeyAndAddress() {
	const [passphrase, privateKey, publicKey, address] = getQuotedStrings(
		this.test.parent.title,
	);
	const keys = {
		privateKey,
		publicKey,
	};

	this.test.ctx.passphrase = passphrase;
	this.test.ctx.keys = keys;
	this.test.ctx.address = address;
}

export function thePassphraseIsGeneratedByTheCreateMnemonicPassphraseFunction() {
	const { passphrase } = this.test.ctx;
	sandbox
		.stub(mnemonicInstance, 'createMnemonicPassphrase')
		.returns(passphrase);
}

export function anAction() {
	const actionName = getFirstQuotedString(this.test.parent.title);
	this.test.ctx.action = getActionCreator(actionName)();
}
```

```js
// test/steps/.../2_when.js

export function theActionIsCalled() {
	const { action } = this.test.ctx;
	const returnValue = action();
	this.test.ctx.returnValue = returnValue;
	return returnValue.catch(e => e);
}
```

```js
// test/steps/.../3_then.js

export function itShouldResolveToAnObjectWithThePassphraseAndThePublicKeyAndTheAddress() {
	const {
		returnValue,
		passphrase,
		keys: { publicKey },
		address,
	} = this.test.ctx;
	const expectedObject = {
		passphrase,
		publicKey,
		address,
	};
	return expect(returnValue).to.eventually.eql(expectedObject);
}
```

Here the **Given** steps are responsible for setup (storing values in the test context and stubbing related functions). The **When** step simply calls the function under test and stores it in the test context. The **Then** step just gathers all the values it needs from the test context and makes a single assertion. A few features to note:

1. These step definitions are normal functions, not arrow functions. They need access to `this`.
1. Some step definitions presuppose that a value has already been set on the test context.
1. Some step definitions use a value extracted from the test title. In the case of a `beforeEach` hook, the relevant test title is `this.test.parent.title` (i.e. the surrounding `describe` block description), but in the case of an `it` call the relevant test title is `this.test.title` directly.
1. In the **When** step we have a `.catch` handler. This is because if you return a `Promise` which is rejected then Mocha fails the test, but in other tests we want to assert that this `Promise` is rejected (in a **Then** step).

## Benefits

More information is available in [this blog post][blog-post], but in brief:

1. Separating specification from test implementation enables clearer thinking about desired source code behaviour.
1. Atomic step definitions results in DRYer, more reusable, more manageable test code.

[blog-post]: https://blog.lisk.io/bdd-style-unit-testing-with-mocha-704137e429d5
