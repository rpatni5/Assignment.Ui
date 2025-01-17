import { UserSummaryModel } from "./user-summary";

export interface AuthResponseModel{
    jwt:string;
    refreshToken:string;
    expiry:Date;
    user?:UserSummaryModel;
}