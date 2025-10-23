import { Mode } from 'porto'

export function tempo() {
  return Mode.from({
    name: 'tempo',
    actions: {
      addFunds() {
        throw new Error('Not implemented')
      },

      createAccount() {
        throw new Error('Not implemented')
      },

      getAccountVersion() {
        throw new Error('Not implemented')
      },

      getAssets() {
        throw new Error('Not implemented')
      },

      getCallsStatus() {
        throw new Error('Not implemented')
      },

      getCapabilities() {
        throw new Error('Not implemented')
      },

      getKeys() {
        throw new Error('Not implemented')
      },

      grantAdmin() {
        throw new Error('Not implemented')
      },

      grantPermissions() {
        throw new Error('Not implemented')
      },

      loadAccounts() {
        throw new Error('Not implemented')
      },

      prepareCalls() {
        throw new Error('Not implemented')
      },

      prepareUpgradeAccount() {
        throw new Error('Not implemented')
      },

      revokeAdmin() {
        throw new Error('Not implemented')
      },

      revokePermissions() {
        throw new Error('Not implemented')
      },

      sendCalls() {
        throw new Error('Not implemented')
      },

      sendPreparedCalls() {
        throw new Error('Not implemented')
      },

      signPersonalMessage() {
        throw new Error('Not implemented')
      },

      signTypedData() {
        throw new Error('Not implemented')
      },

      upgradeAccount() {
        throw new Error('Not implemented')
      },

      verifyEmail() {
        throw new Error('Not implemented')
      },

      disconnect() {
        throw new Error('Not implemented')
      },

      switchChain() {
        throw new Error('Not implemented')
      },
    }
  })
}