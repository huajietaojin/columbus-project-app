const provinces = [
  {
    no: 350000,
    m: "福建省"
  },
  // {
  //   no: 110000,
  //   m: "北京市"
  // },
  // {
  //   no: 120000,
  //   m: "天津市"
  // },
  // {
  //   no: 130000,
  //   m: "河北省"
  // },
  // {
  //   no: 140000,
  //   m: "山西省"
  // },
  // {
  //   no: 150000,
  //   m: "内蒙古自治区"
  // },
  // {
  //   no: 210000,
  //   m: "辽宁省"
  // },
  // {
  //   no: 220000,
  //   m: "吉林省"
  // },
  // {
  //   no: 230000,
  //   m: "黑龙江省"
  // },
  // {
  //   no: 310000,
  //   m: "上海市"
  // },
  {
    no: 320000,
    m: "江苏省"
  },
  {
    no: 330000,
    m: "浙江省"
  },
  // {
  //   no: 340000,
  //   m: "安徽省"
  // },

  // {
  //   no: 360000,
  //   m: "江西省"
  // },
  // {
  //   no: 370000,
  //   m: "山东省"
  // },
  // {
  //   no: 410000,
  //   m: "河南省"
  // },
  // {
  //   no: 420000,
  //   m: "湖北省"
  // },
  // {
  //   no: 430000,
  //   m: "湖南省"
  // },
  {
    no: 440000,
    m: "广东省"
  },
  // {
  //   no: 450000,
  //   m: "广西壮族自治区"
  // },
  // {
  //   no: 460000,
  //   m: "海南省"
  // },
  // {
  //   no: 500000,
  //   m: "重庆市"
  // },
  // {
  //   no: 510000,
  //   m: "四川省"
  // },
  // {
  //   no: 520000,
  //   m: "贵州省"
  // },
  // {
  //   no: 530000,
  //   m: "云南省"
  // },
  // {
  //   no: 540000,
  //   m: "西藏自治区"
  // },
  // {
  //   no: 610000,
  //   m: "陕西省"
  // },
  // {
  //   no: 620000,
  //   m: "甘肃省"
  // },
  // {
  //   no: 630000,
  //   m: "青海省"
  // },
  // {
  //   no: 640000,
  //   m: "宁夏回族自治区"
  // },
  // {
  //   no: 650000,
  //   m: "新疆维吾尔自治区"
  // },
  // {
  //   no: 710000,
  //   m: "台湾省"
  // },
  // {
  //   no: 810000,
  //   m: "香港特别行政区"
  // },
  // {
  //   no: 820000,
  //   m: "澳门特别行政区"
  // }
]

const citys = [{ no: 110100, m: '北京(市区)', pno: 110000 }, { no: 110200, m: '北京(县辖区)', pno: 110000 }, { no: 120100, m: '天津(市区)', pno: 120000 }, { no: 120200, m: '天津(县辖区)', pno: 120000 }, { no: 130100, m: '石家庄市', pno: 130000 }, { no: 130200, m: '唐山市', pno: 130000 }, { no: 130300, m: '秦皇岛市', pno: 130000 }, { no: 130400, m: '邯郸市', pno: 130000 }, { no: 130500, m: '邢台市', pno: 130000 }, { no: 130600, m: '保定市', pno: 130000 }, { no: 130700, m: '张家口市', pno: 130000 }, { no: 130800, m: '承德市', pno: 130000 }, { no: 130900, m: '沧州市', pno: 130000 }, { no: 131000, m: '廊坊市', pno: 130000 }, { no: 131100, m: '衡水市', pno: 130000 }, { no: 140100, m: '太原市', pno: 140000 }, { no: 140200, m: '大同市', pno: 140000 }, { no: 140300, m: '阳泉市', pno: 140000 }, { no: 140400, m: '长治市', pno: 140000 }, { no: 140500, m: '晋城市', pno: 140000 }, { no: 140600, m: '朔州市', pno: 140000 }, { no: 140700, m: '晋中市', pno: 140000 }, { no: 140800, m: '运城市', pno: 140000 }, { no: 140900, m: '忻州市', pno: 140000 }, { no: 141000, m: '临汾市', pno: 140000 }, { no: 141100, m: '吕梁市', pno: 140000 }, { no: 150100, m: '呼和浩特市', pno: 150000 }, { no: 150200, m: '包头市', pno: 150000 }, { no: 150300, m: '乌海市', pno: 150000 }, { no: 150400, m: '赤峰市', pno: 150000 }, { no: 150500, m: '通辽市', pno: 150000 }, { no: 150600, m: '鄂尔多斯市', pno: 150000 }, { no: 150700, m: '呼伦贝尔市', pno: 150000 }, { no: 150800, m: '巴彦淖尔市', pno: 150000 }, { no: 150900, m: '乌兰察布市', pno: 150000 }, { no: 152200, m: '兴安盟', pno: 150000 }, { no: 152500, m: '锡林郭勒盟', pno: 150000 }, { no: 152900, m: '阿拉善盟', pno: 150000 }, { no: 210100, m: '沈阳市', pno: 210000 }, { no: 210200, m: '大连市', pno: 210000 }, { no: 210300, m: '鞍山市', pno: 210000 }, { no: 210400, m: '抚顺市', pno: 210000 }, { no: 210500, m: '本溪市', pno: 210000 }, { no: 210600, m: '丹东市', pno: 210000 }, { no: 210700, m: '锦州市', pno: 210000 }, { no: 210800, m: '营口市', pno: 210000 }, { no: 210900, m: '阜新市', pno: 210000 }, { no: 211000, m: '辽阳市', pno: 210000 }, { no: 211100, m: '盘锦市', pno: 210000 }, { no: 211200, m: '铁岭市', pno: 210000 }, { no: 211300, m: '朝阳市', pno: 210000 }, { no: 211400, m: '葫芦岛市', pno: 210000 }, { no: 220100, m: '长春市', pno: 220000 }, { no: 220200, m: '吉林市', pno: 220000 }, { no: 220300, m: '四平市', pno: 220000 }, { no: 220400, m: '辽源市', pno: 220000 }, { no: 220500, m: '通化市', pno: 220000 }, { no: 220600, m: '白山市', pno: 220000 }, { no: 220700, m: '松原市', pno: 220000 }, { no: 220800, m: '白城市', pno: 220000 }, { no: 222400, m: '延边朝鲜族自治州', pno: 220000 }, { no: 230100, m: '哈尔滨市', pno: 230000 }, { no: 230200, m: '齐齐哈尔市', pno: 230000 }, { no: 230300, m: '鸡西市', pno: 230000 }, { no: 230400, m: '鹤岗市', pno: 230000 }, { no: 230500, m: '双鸭山市', pno: 230000 }, { no: 230600, m: '大庆市', pno: 230000 }, { no: 230700, m: '伊春市', pno: 230000 }, { no: 230800, m: '佳木斯市', pno: 230000 }, { no: 230900, m: '七台河市', pno: 230000 }, { no: 231000, m: '牡丹江市', pno: 230000 }, { no: 231100, m: '黑河市', pno: 230000 }, { no: 231200, m: '绥化市', pno: 230000 }, { no: 232700, m: '大兴安岭地区', pno: 230000 }, { no: 310100, m: '上海(市区)', pno: 310000 }, { no: 310200, m: '上海(县辖区)', pno: 310000 }, { no: 320100, m: '南京市', pno: 320000 }, { no: 320200, m: '无锡市', pno: 320000 }, { no: 320300, m: '徐州市', pno: 320000 }, { no: 320400, m: '常州市', pno: 320000 }, { no: 320500, m: '苏州市', pno: 320000 }, { no: 320600, m: '南通市', pno: 320000 }, { no: 320700, m: '连云港市', pno: 320000 }, { no: 320800, m: '淮安市', pno: 320000 }, { no: 320900, m: '盐城市', pno: 320000 }, { no: 321000, m: '扬州市', pno: 320000 }, { no: 321100, m: '镇江市', pno: 320000 }, { no: 321200, m: '泰州市', pno: 320000 }, { no: 321300, m: '宿迁市', pno: 320000 }, { no: 330100, m: '杭州市', pno: 330000 }, { no: 330200, m: '宁波市', pno: 330000 }, { no: 330300, m: '温州市', pno: 330000 }, { no: 330400, m: '嘉兴市', pno: 330000 }, { no: 330500, m: '湖州市', pno: 330000 }, { no: 330600, m: '绍兴市', pno: 330000 }, { no: 330700, m: '金华市', pno: 330000 }, { no: 330800, m: '衢州市', pno: 330000 }, { no: 330900, m: '舟山市', pno: 330000 }, { no: 331000, m: '台州市', pno: 330000 }, { no: 331100, m: '丽水市', pno: 330000 }, { no: 340100, m: '合肥市', pno: 340000 }, { no: 340200, m: '芜湖市', pno: 340000 }, { no: 340300, m: '蚌埠市', pno: 340000 }, { no: 340400, m: '淮南市', pno: 340000 }, { no: 340500, m: '马鞍山市', pno: 340000 }, { no: 340600, m: '淮北市', pno: 340000 }, { no: 340700, m: '铜陵市', pno: 340000 }, { no: 340800, m: '安庆市', pno: 340000 }, { no: 341000, m: '黄山市', pno: 340000 }, { no: 341100, m: '滁州市', pno: 340000 }, { no: 341200, m: '阜阳市', pno: 340000 }, { no: 341300, m: '宿州市', pno: 340000 }, { no: 341400, m: '巢湖市', pno: 340000 }, { no: 341500, m: '六安市', pno: 340000 }, { no: 341600, m: '亳州市', pno: 340000 }, { no: 341700, m: '池州市', pno: 340000 }, { no: 341800, m: '宣城市', pno: 340000 }, { no: 350100, m: '福州市', pno: 350000 }, { no: 350200, m: '厦门市', pno: 350000 }, { no: 350300, m: '莆田市', pno: 350000 }, { no: 350400, m: '三明市', pno: 350000 }, { no: 350500, m: '泉州市', pno: 350000 }, { no: 350600, m: '漳州市', pno: 350000 }, { no: 350700, m: '南平市', pno: 350000 }, { no: 350800, m: '龙岩市', pno: 350000 }, { no: 350900, m: '宁德市', pno: 350000 }, { no: 360100, m: '南昌市', pno: 360000 }, { no: 360200, m: '景德镇市', pno: 360000 }, { no: 360300, m: '萍乡市', pno: 360000 }, { no: 360400, m: '九江市', pno: 360000 }, { no: 360500, m: '新余市', pno: 360000 }, { no: 360600, m: '鹰潭市', pno: 360000 }, { no: 360700, m: '赣州市', pno: 360000 }, { no: 360800, m: '吉安市', pno: 360000 }, { no: 360900, m: '宜春市', pno: 360000 }, { no: 361000, m: '抚州市', pno: 360000 }, { no: 361100, m: '上饶市', pno: 360000 }, { no: 370100, m: '济南市', pno: 370000 }, { no: 370200, m: '青岛市', pno: 370000 }, { no: 370300, m: '淄博市', pno: 370000 }, { no: 370400, m: '枣庄市', pno: 370000 }, { no: 370500, m: '东营市', pno: 370000 }, { no: 370600, m: '烟台市', pno: 370000 }, { no: 370700, m: '潍坊市', pno: 370000 }, { no: 370800, m: '济宁市', pno: 370000 }, { no: 370900, m: '泰安市', pno: 370000 }, { no: 371000, m: '威海市', pno: 370000 }, { no: 371100, m: '日照市', pno: 370000 }, { no: 371200, m: '莱芜市', pno: 370000 }, { no: 371300, m: '临沂市', pno: 370000 }, { no: 371400, m: '德州市', pno: 370000 }, { no: 371500, m: '聊城市', pno: 370000 }, { no: 371600, m: '滨州市', pno: 370000 }, { no: 371700, m: '荷泽市', pno: 370000 }, { no: 410100, m: '郑州市', pno: 410000 }, { no: 410200, m: '开封市', pno: 410000 }, { no: 410300, m: '洛阳市', pno: 410000 }, { no: 410400, m: '平顶山市', pno: 410000 }, { no: 410500, m: '安阳市', pno: 410000 }, { no: 410600, m: '鹤壁市', pno: 410000 }, { no: 410700, m: '新乡市', pno: 410000 }, { no: 410800, m: '焦作市', pno: 410000 }, { no: 410900, m: '濮阳市', pno: 410000 }, { no: 411000, m: '许昌市', pno: 410000 }, { no: 411100, m: '漯河市', pno: 410000 }, { no: 411200, m: '三门峡市', pno: 410000 }, { no: 411300, m: '南阳市', pno: 410000 }, { no: 411400, m: '商丘市', pno: 410000 }, { no: 411500, m: '信阳市', pno: 410000 }, { no: 411600, m: '周口市', pno: 410000 }, { no: 411700, m: '驻马店市', pno: 410000 }, { no: 420100, m: '武汉市', pno: 420000 }, { no: 420200, m: '黄石市', pno: 420000 }, { no: 420300, m: '十堰市', pno: 420000 }, { no: 420500, m: '宜昌市', pno: 420000 }, { no: 420600, m: '襄樊市', pno: 420000 }, { no: 420700, m: '鄂州市', pno: 420000 }, { no: 420800, m: '荆门市', pno: 420000 }, { no: 420900, m: '孝感市', pno: 420000 }, { no: 421000, m: '荆州市', pno: 420000 }, { no: 421100, m: '黄冈市', pno: 420000 }, { no: 421200, m: '咸宁市', pno: 420000 }, { no: 421300, m: '随州市', pno: 420000 }, { no: 422800, m: '恩施土家族苗族自治州', pno: 420000 }, { no: 429000, m: '省直辖行政单位', pno: 420000 }, { no: 430100, m: '长沙市', pno: 430000 }, { no: 430200, m: '株洲市', pno: 430000 }, { no: 430300, m: '湘潭市', pno: 430000 }, { no: 430400, m: '衡阳市', pno: 430000 }, { no: 430500, m: '邵阳市', pno: 430000 }, { no: 430600, m: '岳阳市', pno: 430000 }, { no: 430700, m: '常德市', pno: 430000 }, { no: 430800, m: '张家界市', pno: 430000 }, { no: 430900, m: '益阳市', pno: 430000 }, { no: 431000, m: '郴州市', pno: 430000 }, { no: 431100, m: '永州市', pno: 430000 }, { no: 431200, m: '怀化市', pno: 430000 }, { no: 431300, m: '娄底市', pno: 430000 }, { no: 433100, m: '湘西土家族苗族自治州', pno: 430000 }, { no: 440100, m: '广州市', pno: 440000 }, { no: 440200, m: '韶关市', pno: 440000 }, { no: 440300, m: '深圳市', pno: 440000 }, { no: 440400, m: '珠海市', pno: 440000 }, { no: 440500, m: '汕头市', pno: 440000 }, { no: 440600, m: '佛山市', pno: 440000 }, { no: 440700, m: '江门市', pno: 440000 }, { no: 440800, m: '湛江市', pno: 440000 }, { no: 440900, m: '茂名市', pno: 440000 }, { no: 441200, m: '肇庆市', pno: 440000 }, { no: 441300, m: '惠州市', pno: 440000 }, { no: 441400, m: '梅州市', pno: 440000 }, { no: 441500, m: '汕尾市', pno: 440000 }, { no: 441600, m: '河源市', pno: 440000 }, { no: 441700, m: '阳江市', pno: 440000 }, { no: 441800, m: '清远市', pno: 440000 }, { no: 441900, m: '东莞市', pno: 440000 }, { no: 442000, m: '中山市', pno: 440000 }, { no: 445100, m: '潮州市', pno: 440000 }, { no: 445200, m: '揭阳市', pno: 440000 }, { no: 445300, m: '云浮市', pno: 440000 }, { no: 450100, m: '南宁市', pno: 450000 }, { no: 450200, m: '柳州市', pno: 450000 }, { no: 450300, m: '桂林市', pno: 450000 }, { no: 450400, m: '梧州市', pno: 450000 }, { no: 450500, m: '北海市', pno: 450000 }, { no: 450600, m: '防城港市', pno: 450000 }, { no: 450700, m: '钦州市', pno: 450000 }, { no: 450800, m: '贵港市', pno: 450000 }, { no: 450900, m: '玉林市', pno: 450000 }, { no: 451000, m: '百色市', pno: 450000 }, { no: 451100, m: '贺州市', pno: 450000 }, { no: 451200, m: '河池市', pno: 450000 }, { no: 451300, m: '来宾市', pno: 450000 }, { no: 451400, m: '崇左市', pno: 450000 }, { no: 460100, m: '海口市', pno: 460000 }, { no: 460200, m: '三亚市', pno: 460000 }, { no: 469000, m: '省直辖县级行政单位', pno: 460000 }, { no: 500100, m: '重庆(市区)', pno: 500000 }, { no: 500200, m: '重庆(县辖区)', pno: 500000 }, { no: 500300, m: '重庆(市)', pno: 500000 }, { no: 510100, m: '成都市', pno: 510000 }, { no: 510300, m: '自贡市', pno: 510000 }, { no: 510400, m: '攀枝花市', pno: 510000 }, { no: 510500, m: '泸州市', pno: 510000 }, { no: 510600, m: '德阳市', pno: 510000 }, { no: 510700, m: '绵阳市', pno: 510000 }, { no: 510800, m: '广元市', pno: 510000 }, { no: 510900, m: '遂宁市', pno: 510000 }, { no: 511000, m: '内江市', pno: 510000 }, { no: 511100, m: '乐山市', pno: 510000 }, { no: 511300, m: '南充市', pno: 510000 }, { no: 511400, m: '眉山市', pno: 510000 }, { no: 511500, m: '宜宾市', pno: 510000 }, { no: 511600, m: '广安市', pno: 510000 }, { no: 511700, m: '达州市', pno: 510000 }, { no: 511800, m: '雅安市', pno: 510000 }, { no: 511900, m: '巴中市', pno: 510000 }, { no: 512000, m: '资阳市', pno: 510000 }, { no: 513200, m: '阿坝藏族羌族自治州', pno: 510000 }, { no: 513300, m: '甘孜藏族自治州', pno: 510000 }, { no: 513400, m: '凉山彝族自治州', pno: 510000 }, { no: 520100, m: '贵阳市', pno: 520000 }, { no: 520200, m: '六盘水市', pno: 520000 }, { no: 520300, m: '遵义市', pno: 520000 }, { no: 520400, m: '安顺市', pno: 520000 }, { no: 522200, m: '铜仁地区', pno: 520000 }, { no: 522300, m: '黔西南布依族苗族自治州', pno: 520000 }, { no: 522400, m: '毕节地区', pno: 520000 }, { no: 522600, m: '黔东南苗族侗族自治州', pno: 520000 }, { no: 522700, m: '黔南布依族苗族自治州', pno: 520000 }, { no: 530100, m: '昆明市', pno: 530000 }, { no: 530300, m: '曲靖市', pno: 530000 }, { no: 530400, m: '玉溪市', pno: 530000 }, { no: 530500, m: '保山市', pno: 530000 }, { no: 530600, m: '昭通市', pno: 530000 }, { no: 530700, m: '丽江市', pno: 530000 }, { no: 530800, m: '思茅市', pno: 530000 }, { no: 530900, m: '临沧市', pno: 530000 }, { no: 532300, m: '楚雄彝族自治州', pno: 530000 }, { no: 532500, m: '红河哈尼族彝族自治州', pno: 530000 }, { no: 532600, m: '文山壮族苗族自治州', pno: 530000 }, { no: 532800, m: '西双版纳傣族自治州', pno: 530000 }, { no: 532900, m: '大理白族自治州', pno: 530000 }, { no: 533100, m: '德宏傣族景颇族自治州', pno: 530000 }, { no: 533300, m: '怒江傈僳族自治州', pno: 530000 }, { no: 533400, m: '迪庆藏族自治州', pno: 530000 }, { no: 540100, m: '拉萨市', pno: 540000 }, { no: 542100, m: '昌都地区', pno: 540000 }, { no: 542200, m: '山南地区', pno: 540000 }, { no: 542300, m: '日喀则地区', pno: 540000 }, { no: 542400, m: '那曲地区', pno: 540000 }, { no: 542500, m: '阿里地区', pno: 540000 }, { no: 542600, m: '林芝地区', pno: 540000 }, { no: 610100, m: '西安市', pno: 610000 }, { no: 610200, m: '铜川市', pno: 610000 }, { no: 610300, m: '宝鸡市', pno: 610000 }, { no: 610400, m: '咸阳市', pno: 610000 }, { no: 610500, m: '渭南市', pno: 610000 }, { no: 610600, m: '延安市', pno: 610000 }, { no: 610700, m: '汉中市', pno: 610000 }, { no: 610800, m: '榆林市', pno: 610000 }, { no: 610900, m: '安康市', pno: 610000 }, { no: 611000, m: '商洛市', pno: 610000 }, { no: 620100, m: '兰州市', pno: 620000 }, { no: 620200, m: '嘉峪关市', pno: 620000 }, { no: 620300, m: '金昌市', pno: 620000 }, { no: 620400, m: '白银市', pno: 620000 }, { no: 620500, m: '天水市', pno: 620000 }, { no: 620600, m: '武威市', pno: 620000 }, { no: 620700, m: '张掖市', pno: 620000 }, { no: 620800, m: '平凉市', pno: 620000 }, { no: 620900, m: '酒泉市', pno: 620000 }, { no: 621000, m: '庆阳市', pno: 620000 }, { no: 621100, m: '定西市', pno: 620000 }, { no: 621200, m: '陇南市', pno: 620000 }, { no: 622900, m: '临夏回族自治州', pno: 620000 }, { no: 623000, m: '甘南藏族自治州', pno: 620000 }, { no: 630100, m: '西宁市', pno: 630000 }, { no: 632100, m: '海东地区', pno: 630000 }, { no: 632200, m: '海北藏族自治州', pno: 630000 }, { no: 632300, m: '黄南藏族自治州', pno: 630000 }, { no: 632500, m: '海南藏族自治州', pno: 630000 }, { no: 632600, m: '果洛藏族自治州', pno: 630000 }, { no: 632700, m: '玉树藏族自治州', pno: 630000 }, { no: 632800, m: '海西蒙古族藏族自治州', pno: 630000 }, { no: 640100, m: '银川市', pno: 640000 }, { no: 640200, m: '石嘴山市', pno: 640000 }, { no: 640300, m: '吴忠市', pno: 640000 }, { no: 640400, m: '固原市', pno: 640000 }, { no: 640500, m: '中卫市', pno: 640000 }, { no: 650100, m: '乌鲁木齐市', pno: 650000 }, { no: 650200, m: '克拉玛依市', pno: 650000 }, { no: 652100, m: '吐鲁番地区', pno: 650000 }, { no: 652200, m: '哈密地区', pno: 650000 }, { no: 652300, m: '昌吉回族自治州', pno: 650000 }, { no: 652700, m: '博尔塔拉蒙古自治州', pno: 650000 }, { no: 652800, m: '巴音郭楞蒙古自治州', pno: 650000 }, { no: 652900, m: '阿克苏地区', pno: 650000 }, { no: 653000, m: '克孜勒苏柯尔克孜自治州', pno: 650000 }, { no: 653100, m: '喀什地区', pno: 650000 }, { no: 653200, m: '和田地区', pno: 650000 }, { no: 654000, m: '伊犁哈萨克自治州', pno: 650000 }, { no: 654200, m: '塔城地区', pno: 650000 }, { no: 654300, m: '阿勒泰地区', pno: 650000 }, { no: 659000, m: '省直辖行政单位', pno: 650000 }]

class CityService {
  static allProvince() {
    return provinces
  }
  static allCity() {
    return citys
  }

  static listCity(pn) {
    let provinceCitys = []
    for (let city of citys) {
      if (pn === city.pno) {
        provinceCitys.push(city)
      }
    }
    return provinceCitys
  }

}

module.exports = CityService; 