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
import { getFirstBoolean } from '../utils';

export function itShouldNotSetTheLiskAPIInstanceTestnetSetting() {
	const { liskAPIInstance } = this.test.ctx;
	return expect(liskAPIInstance.setTestnet).not.to.be.called;
}

export function itShouldSetTheLiskAPIInstanceTestnetSettingTo() {
	const { liskAPIInstance } = this.test.ctx;
	const setting = getFirstBoolean(this.test.title);
	return expect(liskAPIInstance.setTestnet.firstCall).to.be.calledWith(setting);
}

export function itShouldSetTheLiskAPIInstanceTestnetSettingBackToTheOriginalSetting() {
	const { liskAPIInstance } = this.test.ctx;
	return expect(liskAPIInstance.setTestnet.secondCall).to.be.calledWith(false);
}

export function itShouldUseTheLiskAPIInstanceToSendARequestToTheEndpointUsingTheParameters() {
	const { liskAPIInstance, endpoint, parameters } = this.test.ctx;
	return expect(liskAPIInstance.sendRequest).to.be.calledWithExactly(
		endpoint,
		parameters,
	);
}

export function itShouldNotBroadcastTheSignature() {
	const { liskAPIInstance } = this.test.ctx;
	return expect(liskAPIInstance.broadcastSignatures).not.to.be.called;
}

export function itShouldBroadcastTheSignature() {
	const { liskAPIInstance, signature } = this.test.ctx;
	return expect(liskAPIInstance.broadcastSignatures).to.be.calledWithExactly([
		JSON.parse(signature),
	]);
}

export function itShouldNotBroadcastTheTransaction() {
	const { liskAPIInstance } = this.test.ctx;
	return expect(liskAPIInstance.broadcastTransaction).not.to.be.called;
}

export function itShouldBroadcastTheTransaction() {
	const { liskAPIInstance, transaction } = this.test.ctx;
	return expect(liskAPIInstance.broadcastTransaction).to.be.calledWithExactly(
		JSON.parse(transaction),
	);
}

export function itShouldResolveToTheAPIResponse() {
	const { returnValue, apiResponse } = this.test.ctx;
	return expect(returnValue).to.eventually.eql(apiResponse);
}

export function theLiskAPIInstanceShouldBeALiskJSAPIInstance() {
	const { liskAPIInstance } = this.test.ctx;
	return expect(liskAPIInstance).to.be.instanceOf(lisk.api);
}

export function theLiskAPIInstanceShouldSendARequestToTheBlocksGetAPIEndpointWithTheBlockID() {
	const { blockId, liskAPIInstance } = this.test.ctx;
	const route = 'blocks/get';
	const options = { id: blockId };
	return expect(liskAPIInstance.sendRequest).to.be.calledWithExactly(
		route,
		options,
	);
}

export function theLiskAPIInstanceShouldSendARequestToTheAccountsAPIEndpointWithTheAddress() {
	const { address, liskAPIInstance } = this.test.ctx;
	const route = 'accounts';
	const options = { address };
	return expect(liskAPIInstance.sendRequest).to.be.calledWithExactly(
		route,
		options,
	);
}

export function theLiskAPIInstanceShouldSendARequestToTheTransactionsGetAPIEndpointWithTheTransactionID() {
	const { transactionId, liskAPIInstance } = this.test.ctx;
	const route = 'transactions/get';
	const options = { id: transactionId };
	return expect(liskAPIInstance.sendRequest).to.be.calledWithExactly(
		route,
		options,
	);
}

export function theLiskAPIInstanceShouldSendARequestToTheDelegatesGetAPIEndpointWithTheUsername() {
	const { delegateUsername, liskAPIInstance } = this.test.ctx;
	const route = 'delegates/get';
	const options = { username: delegateUsername };
	return expect(liskAPIInstance.sendRequest).to.be.calledWithExactly(
		route,
		options,
	);
}
