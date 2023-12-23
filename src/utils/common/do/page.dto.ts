export class Page {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPageCount: number;

  constructor(
    pageIndex: number,
    pageSize: number,
    totalCount: number,
    totalPageCount: number
  ) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.totalPageCount = totalPageCount;
  }

  public static getPage(requestPage: Page, totalCount: number) {
    let totalPageCount: number = Math.ceil(totalCount / requestPage.pageSize);
    return new Page(
      requestPage.pageIndex,
      requestPage.pageSize,
      totalCount,
      totalPageCount
    );
  }
}