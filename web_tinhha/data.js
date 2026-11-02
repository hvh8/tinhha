// Cấu hình tối đa hóa lượt click quảng cáo Adsterra (Full 6 mã + Bẫy click theo lượt)
const adConfig = {
  enabled: true,

  // 1. Direct Link (/4/) — Mở định kỳ sau mỗi N lần bấm trong suốt quá trình chơi
  directLinkUrl: "https://arwf.org/4/3b39960958298b4904ddbc166f809360",
  clicksPerDirectLink: 5,      // Cứ mỗi 5 lần người chơi chạm/click trong game sẽ tự mở Direct Link 1 lần
  minIntervalSeconds: 12,      // Khoảng cách tối thiểu giữa 2 lần nổ Direct Link (giây)
  triggerOnStart: true,        // Mở ngay khi bấm "Bắt đầu →"
  triggerOnNextBoard: true,    // Mở khi bấm "Tiếp theo →" qua bảng mới (mỗi 2 bảng/lần)
  triggerOnUndo: true,         // Mở ngay khi bấm "← Hoàn tác lượt trước"
  triggerOnShareOrRestart: true, // Mở ngay khi bấm "Chia sẻ Top 9" hoặc "Tạo bảng mới"

  // 2. Toàn bộ các mã Script & Banner của bạn (đã gắn trực tiếp trong index.html)
  popunderScriptUrl: "https://afders.org/1/fc7d7b01640d16eb90ceeff38d07f0bb",
  socialBarScriptUrl: "https://bicea.org/14/327b32398eb2fb5b4d7bb369d957be25",
  nativeBannerScriptUrl: "https://bicea.org/21/cf2db03619af6eb00269ffddd6f24328",
  banner320x50Key: "a0dab122976594514de40bf4a767a765",
  banner160x300Key: "492245c9459878e447b2d2db1a3ff2dc"
};

const seasons = [
  { id: "2024", name: "Anh Trai Say Hi 2024", members: 30 },
  { id: "2025", name: "Anh Trai Say Hi 2025", members: 30 },
  { id: "tinh-ha", name: "Tinh Hà SayHi", members: 24 }
];

const season2024 = [
  { id: "tage", name: "Tage", photo: "assets/2024/480490899_1203222588140865_3447950540835670544_n.jpg" },
  { id: "hieuthuhai", name: "HIEUTHUHAI", photo: "assets/2024/480511562_1203222308140893_2547632285813876580_n.jpg" },
  { id: "duong-domic", name: "Dương Domic", photo: "assets/2024/480698687_1203222511474206_3972674273711969939_n.jpg" },
  { id: "quang-hung-masterd", name: "Quang Hùng MasterD", photo: "assets/2024/480727274_1203222531474204_1999625441099049635_n.jpg" },
  { id: "hai-dang-doo", name: "Hải Đăng Doo", photo: "assets/2024/480761457_1203222508140873_3945001400031190018_n.jpg" },
  { id: "anh-tu-atus", name: "Anh Tú Atus", photo: "assets/2024/480761830_1203222328140891_4157347732149722112_n.jpg" },
  { id: "vu-thinh", name: "Vũ Thịnh", photo: "assets/2024/480762479_1203223538140770_4559162215802814135_n.jpg" },
  { id: "negav", name: "Negav", photo: "assets/2024/480772995_1203222551474202_7918608388740128768_n.jpg" },
  { id: "isaac", name: "Isaac", photo: "assets/2024/480775193_1203222574807533_2668081684795216711_n.jpg" },
  { id: "gin-tuan-kiet", name: "Gin Tuấn Kiệt", photo: "assets/2024/480806707_1203222634807527_5743365854244452981_n.jpg" },
  { id: "lou-hoang", name: "Lou Hoàng", photo: "assets/2024/480808276_1203222631474194_4289869144564854150_n.jpg" },
  { id: "phap-kieu", name: "Pháp Kiều", photo: "assets/2024/480845137_1203222648140859_1836382550218048430_n.jpg" },
  { id: "do-phu-qui", name: "Đỗ Phú Quí", photo: "assets/2024/480852085_1203222448140879_3948358394435636723_n.jpg" },
  { id: "rhyder", name: "RHYDER", photo: "assets/2024/480852725_1203222654807525_9065899356659470529_n.jpg" },
  { id: "hung-huynh", name: "Hùng Huỳnh", photo: "assets/2024/480856734_1203222514807539_569114625935454645_n.jpg" },
  { id: "pham-anh-duy", name: "Phạm Anh Duy", photo: "assets/2024/480859325_1203222554807535_2724762705922069174_n.jpg" },
  { id: "duc-phuc", name: "Đức Phúc", photo: "assets/2024/480869474_1203223548140769_932870299867224367_n.jpg" },
  { id: "jsol", name: "JSOL", photo: "assets/2024/480944614_1203222524807538_6571694874729783271_n.jpg" },
  { id: "cong-duong", name: "Công Dương", photo: "assets/2024/480968434_1203222484807542_2381009334202350181_n.jpg" },
  { id: "song-luan", name: "Song Luân", photo: "assets/2024/480971391_1203222518140872_6114607350597459977_n.jpg" },
  { id: "pham-dinh-thai-ngan", name: "Phạm Đình Thái Ngân", photo: "assets/2024/481057033_1203222561474201_3396937617681830917_n.jpg" },
  { id: "wean", name: "WEAN", photo: "assets/2024/481109518_1203222544807536_395054625593535655_n.jpg" },
  { id: "ali-hoang-duong", name: "Ali Hoàng Dương", photo: "assets/2024/481136330_1203222428140881_3095833073847317998_n.jpg" },
  { id: "quan-ap", name: "Quân A.P", photo: "assets/2024/481166646_1203222351474222_3133532956248007797_n.jpg" },
  { id: "erik", name: "ERIK", photo: "assets/2024/481240215_1203223584807432_4890637419035553858_n.jpg" },
  { id: "anh-tu", name: "Anh Tú", photo: "assets/2024/481277293_1203222701474187_3500303117864559175_n.jpg" },
  { id: "hurrykng", name: "HURRYKNG", photo: "assets/2024/481288415_1203222304807560_6206246846291000856_n.jpg" },
  { id: "nicky", name: "Nicky", photo: "assets/2024/481296736_1203222738140850_529996424635160919_n.jpg" },
  { id: "quang-trung", name: "Quang Trung", photo: "assets/2024/481498291_1203222521474205_6112102165499760471_n.jpg" },
  { id: "captain", name: "Captain", photo: "assets/2024/481775711_1203222558140868_8011990115470067675_n.jpg" }
];

const season2025 = [
  { id: "2025-gill", name: "GILL", photo: "assets/2025/529693542_1342681904194932_7133517507690609058_n.jpg" },
  { id: "2025-jey-b", name: "JEY B", photo: "assets/2025/529838152_1342772464185876_4896210287426495650_n.jpg" },
  { id: "2025-nham-phuong-nam", name: "Nhâm Phương Nam", photo: "assets/2025/529948730_1342772387519217_8608856574669690500_n.jpg" },
  { id: "2025-vuong-binh", name: "Vương Bình", photo: "assets/2025/530355598_1342583040871485_1563228553531825435_n.jpg" },
  { id: "2025-negav", name: "NEGAV", photo: "assets/2025/530425905_1342681887528267_843036773408167262_n.jpg" },
  { id: "2025-ryn-lee", name: "RYN LEE", photo: "assets/2025/530556455_1342634434199679_2284127753455107995_n.jpg" },
  { id: "2025-mason-nguyen", name: "MASON NGUYỄN", photo: "assets/2025/530570467_1342681924194930_1708052729540839304_n.jpg" },
  { id: "2025-karik", name: "KARIK", photo: "assets/2025/530583578_1342667254196397_3469250826554911675_n.jpg" },
  { id: "2025-bui-truong-linh", name: "Bùi Trường Linh", photo: "assets/2025/530653051_1342583047538151_8809297601214630356_n.jpg" },
  { id: "2025-b-ray", name: "B RAY", photo: "assets/2025/530703560_1342634430866346_9155390140527229565_n.jpg" },
  { id: "2025-jaysonlei", name: "JaysonLei", photo: "assets/2025/530746249_1342681964194926_6956484913632574421_n.jpg" },
  { id: "2025-phuc-du", name: "PHÚC DU", photo: "assets/2025/530789725_1342749034188219_4158735242317872706_n.jpg" },
  { id: "2025-hustlang-robber", name: "HUSTLANG ROBBER", photo: "assets/2025/530796961_1342749010854888_5905609797141302718_n.jpg" },
  { id: "2025-lohan", name: "LOHAN", photo: "assets/2025/530806476_1342730614190061_8872225619274790194_n.jpg" },
  { id: "2025-ngo-kien-huy", name: "Ngô Kiến Huy", photo: "assets/2025/530924163_1342622064200916_1828509759396018986_n.jpg" },
  { id: "2025-hai-nam", name: "Hải Nam", photo: "assets/2025/530995536_1342749067521549_1394005761773373909_n.jpg" },
  { id: "2025-otis", name: "OTIS", photo: "assets/2025/531081438_1342749054188217_8166614325437059521_n.jpg" },
  { id: "2025-thai-ngan", name: "Thái Ngân", photo: "assets/2025/531148234_1342681960861593_6435215768311744293_n.jpg" },
  { id: "2025-bui-duy-ngoc", name: "Bùi Duy Ngọc", photo: "assets/2025/531300562_1342634484199674_3780918843335545698_n.jpg" },
  { id: "2025-bigdaddy", name: "BIGDADDY", photo: "assets/2025/531365173_1342772414185881_8290076930780582365_n.jpg" },
  { id: "2025-dillan-hoang-phan", name: "DILLAN HOÀNG PHAN", photo: "assets/2025/531401398_1342730567523399_6318764429538698595_n.jpg" },
  { id: "2025-congb", name: "CONGB", photo: "assets/2025/531516061_1342730660856723_1742501703256320774_n.jpg" },
  { id: "2025-son-k", name: "Sơn.K", photo: "assets/2025/531633439_1342730610856728_3049025080751120396_n.jpg" },
  { id: "2025-cody-nam-vo", name: "Cody Nam Võ", photo: "assets/2025/532038270_1342582994204823_8349672547077189021_n.jpg" },
  { id: "2025-rio", name: "RIO", photo: "assets/2025/532053071_1342582974204825_7947323843007350731_n.jpg" },
  { id: "2025-ogenus", name: "OGENUS", photo: "assets/2025/532248833_1342748980854891_2499700944090665383_n.jpg" },
  { id: "2025-do-nam-son", name: "Đỗ Nam Sơn", photo: "assets/2025/532391101_1342730657523390_5972631185987657086_n.jpg" },
  { id: "2025-khoi-vu", name: "Khôi Vũ", photo: "assets/2025/532588468_1342634487533007_1435127514224904053_n.jpg" },
  { id: "2025-tez", name: "TEZ", photo: "assets/2025/532668327_1342772460852543_422153134385075761_n.jpg" },
  { id: "2025-vu-cat-tuong", name: "Vũ Cát Tường", photo: "assets/2025/532944938_1342772447519211_7267283600246007112_n.jpg" }
];

const seasonTinhHa = [
  { id: "tinh-ha-vuong-binh", name: "Vương Bình", photo: "assets/tinh-ha/708377258_122105907812633607_7991441886610243248_n.jpg" },
  { id: "tinh-ha-captain-boy", name: "Captain Boy", photo: "assets/tinh-ha/708394645_122106080966633607_1450471720824930348_n.jpg" },
  { id: "tinh-ha-song-luan", name: "Song Luân", photo: "assets/tinh-ha/708394913_122105896040633607_7613840842179800794_n.jpg" },
  { id: "tinh-ha-coolkid", name: "Coolkid", photo: "assets/tinh-ha/708442449_122105895656633607_8784868080522379948_n.jpg" },
  { id: "tinh-ha-wren-evans", name: "Wren Evans", photo: "assets/tinh-ha/708443032_122106081026633607_2593492744575473169_n.jpg" },
  { id: "tinh-ha-dillan", name: "Dillan", photo: "assets/tinh-ha/708451081_122106079160633607_3104596054189473188_n.jpg" },
  { id: "tinh-ha-son-k", name: "Sơn.K", photo: "assets/tinh-ha/708451306_122105896100633607_8668765327317167344_n.jpg" },
  { id: "tinh-ha-duong-domic", name: "Dương Domic", photo: "assets/tinh-ha/708468935_122106066794633607_1599258235479671474_n.jpg" },
  { id: "tinh-ha-wean", name: "WEAN", photo: "assets/tinh-ha/708504402_122106079238633607_3411681005291981634_n.jpg" },
  { id: "tinh-ha-jaysonlei", name: "JaysonLei", photo: "assets/tinh-ha/709468059_122105895632633607_3337343562280174028_n.jpg" },
  { id: "tinh-ha-congb", name: "CongB", photo: "assets/tinh-ha/709486370_122105896436633607_4224571331210985864_n.jpg" },
  { id: "tinh-ha-ali-hoang-duong", name: "Ali Hoàng Dương", photo: "assets/tinh-ha/709590517_122106066698633607_3903263698864678063_n.jpg" },
  { id: "tinh-ha-phap-kieu", name: "Pháp Kiều", photo: "assets/tinh-ha/709590759_122106066818633607_7576266489705812689_n.jpg" },
  { id: "tinh-ha-jsol", name: "JSOL", photo: "assets/tinh-ha/709635805_122105896346633607_2395487729887477940_n.jpg" },
  { id: "tinh-ha-the-thien", name: "Thế Thiên", photo: "assets/tinh-ha/709636564_122106081068633607_7884562743061469587_n.jpg" },
  { id: "tinh-ha-hurrykng", name: "HURRYKNG", photo: "assets/tinh-ha/709637675_122105896400633607_5745428736185640715_n.jpg" },
  { id: "tinh-ha-cody-nam-vo", name: "Cody Nam Võ", photo: "assets/tinh-ha/709646645_122105895602633607_2916943984521050995_n.jpg" },
  { id: "tinh-ha-quang-hung-masterd", name: "Quang Hùng MasterD", photo: "assets/tinh-ha/709670189_122105895542633607_4505727628809269644_n.jpg" },
  { id: "tinh-ha-kimlong", name: "KimLong", photo: "assets/tinh-ha/709679868_122106079280633607_8679928045935154757_n.jpg" },
  { id: "tinh-ha-xuan-dinh-ky", name: "Xuân Định Kỳ", photo: "assets/tinh-ha/709679958_122106079196633607_2139193971917100336_n.jpg" },
  { id: "tinh-ha-ivan", name: "IVAN", photo: "assets/tinh-ha/709689095_122106081086633607_3491577063268046073_n.jpg" },
  { id: "tinh-ha-dang-hong-hai", name: "Đặng Hồng Hải", photo: "assets/tinh-ha/709821474_122106082796633607_4138745847644915307_n.jpg" },
  { id: "tinh-ha-bui-truong-linh", name: "Bùi Trường Linh", photo: "assets/tinh-ha/709882831_122105896010633607_8971603352365041002_n.jpg" },
  { id: "tinh-ha-hyo", name: "HYO", photo: "assets/tinh-ha/710782181_122105896064633607_9222387278470293852_n.jpg" }
];

const seasonMembers = {
  "2024": season2024,
  "2025": season2025,
  "tinh-ha": seasonTinhHa
};
