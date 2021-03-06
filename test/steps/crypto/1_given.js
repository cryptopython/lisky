/*
 * LiskHQ/lisky
 * Copyright © 2017 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
import lisk from 'lisk-js';
import cryptography from '../../../src/utils/cryptography';
import * as inputUtils from '../../../src/utils/input/utils';
import { getFirstQuotedString, getQuotedStrings } from '../utils';

export function theMessageUnderThePassphraseHasSignature() {
	const signature = getFirstQuotedString(this.test.parent.title);
	this.test.ctx.signature = signature;
}

export function aCryptoInstance() {
	this.test.ctx.cryptography = cryptography;
}

export function aCryptoInstanceHasBeenInitialised() {
	const cryptoResult = {
		some: 'result',
		testing: 123,
	};
	[
		'encryptMessage',
		'decryptMessage',
		'encryptPassphrase',
		'decryptPassphrase',
		'getKeys',
		'getAddressFromPublicKey',
		'signMessage',
	].forEach(methodName => cryptography[methodName].returns(cryptoResult));

	this.test.ctx.cryptoResult = cryptoResult;
	this.test.ctx.cryptography = cryptography;
}

export function aSenderPublicKey() {
	const senderPublicKey = getFirstQuotedString(this.test.parent.title);
	this.test.ctx.senderPublicKey = senderPublicKey;
}

export function aNonce() {
	const nonce = getFirstQuotedString(this.test.parent.title);
	this.test.ctx.nonce = nonce;
}

export function anEncryptedMessage() {
	const message = getFirstQuotedString(this.test.parent.title);
	this.test.ctx.message = message;
}

export function aPassphrase() {
	const passphrase = getFirstQuotedString(this.test.parent.title);
	if (typeof inputUtils.getPassphrase.resolves === 'function') {
		inputUtils.getPassphrase.resolves(passphrase);
	}
	this.test.ctx.passphrase = passphrase;
}

export function aSecondPassphrase() {
	const secondPassphrase = getFirstQuotedString(this.test.parent.title);
	if (typeof inputUtils.getPassphrase.resolves === 'function') {
		inputUtils.getPassphrase.onSecondCall().resolves(secondPassphrase);
	}
	this.test.ctx.secondPassphrase = secondPassphrase;
}

export function aPassphraseWithPublicKey() {
	const [passphrase, publicKey] = getQuotedStrings(this.test.parent.title);
	cryptography.getKeys.returns({ publicKey });

	this.test.ctx.passphrase = passphrase;
	this.test.ctx.publicKey = publicKey;
}

export function aPassphraseWithPrivateKeyAndPublicKeyAndAddress() {
	const [passphrase, privateKey, publicKey, address] = getQuotedStrings(
		this.test.parent.title,
	);
	const keys = {
		privateKey,
		publicKey,
	};

	if (typeof lisk.crypto.getKeys.returns === 'function') {
		lisk.crypto.getKeys.returns(keys);
	}
	if (typeof lisk.crypto.decryptPassphraseWithPassword.returns === 'function') {
		lisk.crypto.decryptPassphraseWithPassword.returns(passphrase);
	}
	if (typeof lisk.crypto.getAddressFromPublicKey.returns === 'function') {
		lisk.crypto.getAddressFromPublicKey.returns(address);
	}

	if (typeof cryptography.getKeys.returns === 'function') {
		cryptography.getKeys.returns(keys);
	}
	if (typeof cryptography.decryptPassphrase.returns === 'function') {
		cryptography.decryptPassphrase.returns({ passphrase });
	}
	if (typeof cryptography.getAddressFromPublicKey.returns === 'function') {
		cryptography.getAddressFromPublicKey.returns({ address });
	}

	this.test.ctx.passphrase = passphrase;
	this.test.ctx.keys = keys;
	this.test.ctx.address = address;
}

export function aPassword() {
	const password = getFirstQuotedString(this.test.parent.title);
	this.test.ctx.password = password;
}

export function anEncryptedPassphraseWithAnIV() {
	const [encryptedPassphrase, iv] = getQuotedStrings(this.test.parent.title);
	const cipherAndIv = {
		cipher: encryptedPassphrase,
		iv,
	};
	if (typeof lisk.crypto.encryptPassphraseWithPassword.returns === 'function') {
		lisk.crypto.encryptPassphraseWithPassword.returns(cipherAndIv);
	}

	this.test.ctx.cipherAndIv = cipherAndIv;
}

export function aMessage() {
	const message = getFirstQuotedString(this.test.parent.title);

	if (typeof lisk.crypto.decryptMessageWithPassphrase.returns === 'function') {
		lisk.crypto.decryptMessageWithPassphrase.returns(message);
	}

	this.test.ctx.message = message;
}

export function aRecipient() {
	const recipient = getFirstQuotedString(this.test.parent.title);
	this.test.ctx.recipient = recipient;
}

export function aRecipientPassphraseWithPrivateKeyAndPublicKey() {
	const [passphrase, privateKey, publicKey] = getQuotedStrings(
		this.test.parent.title,
	);
	this.test.ctx.recipientPassphrase = passphrase;
	this.test.ctx.recipientKeys = {
		privateKey,
		publicKey,
	};
}

export function anEncryptedMessageWithANonce() {
	const [cipher, nonce] = getQuotedStrings(this.test.parent.title);
	const cipherAndNonce = {
		cipher,
		nonce,
	};

	lisk.crypto.encryptMessageWithPassphrase.returns(cipherAndNonce);

	this.test.ctx.cipherAndNonce = cipherAndNonce;
}
