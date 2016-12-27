
export enum SiteUsersStatus {
    fetching,
    fetched,
    error
}
export class SiteUser {
    constructor(public id: number, public value: string) { }
}
export class SiteUsers {
    public status: SiteUsersStatus;
    public siteUser: Array<SiteUser>;
    constructor(
        /** Th eurl opf  the site that contains the lookup list  */
        public siteUrl: string,

    ) {
        this.status = SiteUsersStatus.fetching;
        this.siteUser = new Array<SiteUser>();
    }
}
