export interface Port {
  /**
   * UN/LOCODE (5位大写字母)
   */
  code: string;
  
  /**
   * 中文名称
   */
  name_cn: string;
  
  /**
   * 英文名称
   */
  name_en: string;
  
  /**
   * 所属国家名称/代码
   */
  country: string;
  
  /**
   * IANA 时区 (如 Asia/Shanghai)
   */
  timezone: string;
}
