import {GroupNotify, GroupNotifyStatus} from "../../../ntqqapi/types";
import BaseAction from "../BaseAction";
import {ActionName} from "../types";
import {NTQQApi} from "../../../ntqqapi/ntcall";
import {uidMaps} from "../../../common/data";
import {log} from "../../../common/utils";

interface OB11GroupRequestNotify {
    group_id: number,
    user_id: number,
    flag: string
}

export default class GetGroupAddRequest extends BaseAction<null, OB11GroupRequestNotify[]> {
    actionName = ActionName.GetGroupIgnoreAddRequest

    protected async _handle(payload: null): Promise<OB11GroupRequestNotify[]> {
        const data = await NTQQApi.getGroupIgnoreNotifies()
        log(data);
        let notifies: GroupNotify[] = data.notifies.filter(notify => notify.status === GroupNotifyStatus.WAIT_HANDLE);
        let returnData: OB11GroupRequestNotify[] = []
        for (const notify of notifies) {
            const uin = uidMaps[notify.user1.uid] || (await NTQQApi.getUserDetailInfo(notify.user1.uid))?.uin
            returnData.push({
                group_id: parseInt(notify.group.groupCode),
                user_id: parseInt(uin),
                flag: notify.seq
            })
        }
        return returnData;
    }
}