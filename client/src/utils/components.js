import {useAuth} from "../auth/AuthStateHolder";
import {requireEnumByName, UserRole} from "../api/enums";

export function isUserHasRoleAtLeast(user, roleAtLeast) {
    if (roleAtLeast != null) {
        if (user == null) {
            return false;
        }
        const curRole = requireEnumByName(UserRole, user.role);
        if (curRole.order < roleAtLeast.order) {
            return false;
        }
    }
    return true
}

export function If(props) {
    const { authInfo } = useAuth();
    if (props.cond != null && props.cond !== true) {
        return null;
    }
    if (props.roleAtLeast != null) {
        if (!isUserHasRoleAtLeast(authInfo.user, props.roleAtLeast)) {
            return null
        }
    }
    if (props.component != null) {
        return props.component()
    }
    return props.children
}