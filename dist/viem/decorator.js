// TODO:
// - add `.call` to namespaces
// - add `.simulate` to namespaces
// - add `.estimateGas` to namespaces
// - add "watch" actions for events
import * as tokenActions from "./actions/token.js";
export function decorator() {
    return (client) => {
        return {
            token: {
                approve: (parameters) => tokenActions.approve(client, parameters),
                burnBlocked: (parameters) => tokenActions.burnBlocked(client, parameters),
                burn: (parameters) => tokenActions.burn(client, parameters),
                changeTransferPolicy: (parameters) => tokenActions.changeTransferPolicy(client, parameters),
                create: (parameters) => tokenActions.create(client, parameters),
                getAllowance: (parameters) => tokenActions.getAllowance(client, parameters),
                // @ts-expect-error
                getBalance: (parameters) => tokenActions.getBalance(client, parameters),
                getMetadata: (parameters) => tokenActions.getMetadata(client, parameters),
                // @ts-expect-error
                getUserToken: (parameters) => 
                // @ts-expect-error
                tokenActions.getUserToken(client, parameters),
                grantRoles: (parameters) => tokenActions.grantRoles(client, parameters),
                mint: (parameters) => tokenActions.mint(client, parameters),
                pause: (parameters) => tokenActions.pause(client, parameters),
                permit: (parameters) => tokenActions.permit(client, parameters),
                renounceRoles: (parameters) => tokenActions.renounceRoles(client, parameters),
                revokeRoles: (parameters) => tokenActions.revokeRoles(client, parameters),
                setSupplyCap: (parameters) => tokenActions.setSupplyCap(client, parameters),
                setRoleAdmin: (parameters) => tokenActions.setRoleAdmin(client, parameters),
                setUserToken: (parameters) => tokenActions.setUserToken(client, parameters),
                transfer: (parameters) => tokenActions.transfer(client, parameters),
                unpause: (parameters) => tokenActions.unpause(client, parameters),
                watchApprove: (parameters) => tokenActions.watchApprove(client, parameters),
                watchBurn: (parameters) => tokenActions.watchBurn(client, parameters),
                watchCreate: (parameters) => tokenActions.watchCreate(client, parameters),
                watchMint: (parameters) => tokenActions.watchMint(client, parameters),
                watchSetUserToken: (parameters) => tokenActions.watchSetUserToken(client, parameters),
                watchAdminRole: (parameters) => tokenActions.watchAdminRole(client, parameters),
                watchRole: (parameters) => tokenActions.watchRole(client, parameters),
                watchTransfer: (parameters) => tokenActions.watchTransfer(client, parameters),
            },
        };
    };
}
//# sourceMappingURL=decorator.js.map