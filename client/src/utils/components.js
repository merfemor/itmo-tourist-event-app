import {useAuth} from "../auth/AuthStateHolder";
import {requireEnumByName, UserRole} from "../api/enums";

export function If(props) {
    const { authInfo } = useAuth();
    if (props.cond != null && props.cond !== true) {
        return null;
    }
    if (props.roleAtLeast != null) {
        if (authInfo.user == null) {
            return null;
        }
        const myRole = requireEnumByName(UserRole, authInfo.user.role);
        if (myRole.order < props.roleAtLeast.order) {
            return null;
        }
    }
    if (props.component != null) {
        return props.component()
    }
    return props.children
}