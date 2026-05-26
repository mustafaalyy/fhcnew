// Mock data for Family Health Care Hospital

export const INITIAL_SPECIALTIES = [
  {
    id: "cardiology",
    name: "قلب وباطنة",
    nameEn: "Cardiology & Internal Medicine",
    icon: "Heart",
    image: "https://images.unsplash.com/photo-1628348017894-3d48d5009746?auto=format&fit=crop&q=80&w=500",
    description: "رعاية شاملة لصحة القلب والأوعية الدموية والأمراض الباطنية المزمنة والحادة بأحدث التقنيات.",
    features: [
      "تخطيط القلب الكهربائي والمجهود (ECG & Stress Test)",
      "متابعة وعلاج ضغط الدم المرتفع والمنخفض",
      "علاج أمراض الشرايين التاجية وضعف عضلة القلب",
      "تشخيص وعلاج اضطرابات نظم القلب"
    ]
  },
  {
    id: "orthopedics",
    name: "عظام",
    nameEn: "Orthopedics",
    icon: "Activity",
    image: "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=500",
    description: "علاج تشوهات وعيوب العظام والمفاصل والعمود الفقري وإصابات الملاعب والكسور بأعلى كفاءة.",
    features: [
      "علاج إصابات الملاعب والرباط الصليبي والغضاريف",
      "عمليات تغيير المفاصل (الركبة والفخذ)",
      "علاج خشونة المفاصل والتهابات الأوتار",
      "تثبيت الكسور وعلاج تشوهات العظام"
    ]
  },
  {
    id: "pediatrics",
    name: "أطفال",
    nameEn: "Pediatrics",
    icon: "Baby",
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=500",
    description: "رعاية متكاملة لحديثي الولادة والأطفال والمراهقين لمتابعة النمو والتطور البدني والذهني.",
    features: [
      "متابعة حديثي الولادة والمبتسرين",
      "جدول التطعيمات الأساسية والإضافية",
      "علاج أمراض الصدر والجهاز التنفسي للأطفال",
      "متابعة النمو والتغذية الصحية للأطفال"
    ]
  },
  {
    id: "obgyn",
    name: "نساء وتوليد",
    nameEn: "Obstetrics & Gynecology",
    icon: "User",
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=500",
    description: "رعاية صحية متميزة للمرأة في كافة مراحل حياتها، ومتابعة الحمل والولادة الطبيعية والقيصرية.",
    features: [
      "متابعة الحمل الحرج وعالي الخطورة بأجهزة السونار 4D",
      "الولادة بدون ألم (طبيعية وقيصرية)",
      "علاج تأخر الإنجاب وتكيس المبايض",
      "الكشف المبكر عن الأورام النسائية وصحة المرأة"
    ]
  },
  {
    id: "dentistry",
    name: "أسنان",
    nameEn: "Dentistry",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=500",
    description: "خدمات طب وتجميل الأسنان بأحدث التقنيات الرقمية لابتسامة مشرقة وصحية.",
    features: [
      "زراعة وتجميل الأسنان (فينير وهوليود سمايل)",
      "علاج عصب وجذور الأسنان في جلسة واحدة",
      "تقويم الأسنان بأحدث الأنظمة الشفافة والمعدنية",
      "تبييض الأسنان بالليزر وتنظيف الجير"
    ]
  },
  {
    id: "neurology",
    name: "مخ وأعصاب",
    nameEn: "Neurology",
    icon: "Brain",
    image: "https://images.unsplash.com/photo-1559757175-5700def835be?auto=format&fit=crop&q=80&w=500",
    description: "تشخيص وعلاج أمراض الجهاز العصبي المركزي والطرفي والعمود الفقري والصداع المزمن.",
    features: [
      "علاج الصداع النصفي والمزمن وآلام الوجه والفكين",
      "متابعة وعلاج حالات الصرع والتشنجات",
      "تشخيص السكتات الدماغية والتهاب الأعصاب الطرفية",
      "علاج التصلب المتعدد (MS) والزهايمر والشلل الرعاش"
    ]
  },
  {
    id: "laboratory",
    name: "مختبر وتحاليل",
    nameEn: "Laboratory",
    icon: "FlaskConical",
    image: "https://images.unsplash.com/photo-1579154767077-472f88b3852d?auto=format&fit=crop&q=80&w=500",
    description: "مختبر مجهز بأحدث الأجهزة التحليلية الأوتوماتيكية لضمان أدق النتائج وأسرعها.",
    features: [
      "تحاليل الدم الشاملة والهرمونات ودلالات الأورام",
      "الفحوصات الدورية وباقات الاطمئنان الشاملة",
      "فحوصات ما قبل الزواج والتحاليل الوراثية",
      "خدمة سحب العينات من المنازل"
    ]
  },
  {
    id: "radiology",
    name: "أشعة",
    nameEn: "Radiology",
    icon: "FileText",
    image: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=500",
    description: "قسم أشعة متكامل يضم أحدث أجهزة السونار، الأشعة السينية، والرنين المغناطيسي لخدمتكم 24 ساعة.",
    features: [
      "أشعة سينية رقمية (Digital X-Ray)",
      "أشعة الموجات فوق الصوتية (Ultrasound & Doppler)",
      "الأشعة المقطعية والرنين المغناطيسي الحديث",
      "فحص الماموجرام للكشف المبكر عن سرطان الثدي"
    ]
  },
  {
    id: "ophthalmology",
    name: "عيون",
    nameEn: "Ophthalmology",
    icon: "Eye",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=500",
    description: "رعاية كاملة للعيون وتصحيح الإبصار بالليزر والليزك وعلاج المياه البيضاء والزرقاء.",
    features: [
      "عمليات تصحيح الإبصار بالليزك والفيمتو ليزك",
      "إزالة المياه البيضاء بالموجات فوق الصوتية (الفيكو)",
      "فحص قاع العين ومتابعة اعتلال الشبكية السكري",
      "قياس ضغط العين وعلاج المياه الزرقاء"
    ]
  },
  {
    id: "ent",
    name: "أنف وأذن وحنجرة",
    nameEn: "ENT",
    icon: "Volume2",
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=500",
    description: "تشخيص وعلاج أمراض الأذن والأنف والجيوب الأنفية والحنجرة للأطفال والبالغين.",
    features: [
      "علاج الجيوب الأنفية بالمنظار واستعدال حاجز الأنف",
      "تشخيص وعلاج الدوار والدوخة وطنين الأذن",
      "عمليات استئصال اللوزتين واللحمية بأحدث التقنيات",
      "قياس السمع وضغط الأذن"
    ]
  },
  {
    id: "surgery",
    name: "جراحة عامة",
    nameEn: "General Surgery",
    icon: "Scissors",
    image: "https://images.unsplash.com/photo-1581594541451-330aafd4e85c?auto=format&fit=crop&q=80&w=500",
    description: "عمليات الجراحة العامة والمناظير بأحدث التقنيات الجراحية لضمان سرعة التعافي وأمان تام.",
    features: [
      "جراحات الفتق بأنواعه واستئصال المرارة بالمنظار",
      "جراحات الجهاز الهضمي والقولون والغدة الدرقية",
      "علاج وجراحات السمنة المفرطة وتكميم المعدة",
      "رعاية ما بعد الجراحة ومتابعة الجروح المزمنة"
    ]
  },
  {
    id: "er",
    name: "طوارئ",
    nameEn: "Emergency Room (ER)",
    icon: "Flame",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=500",
    description: "طوارئ مجهزة على مدار الساعة لاستقبال الحوادث والحالات الحرجة فوراً بفريق طبي متكامل وسيارات إسعاف.",
    features: [
      "استقبال الحالات الحرجة والحوادث 24/7",
      "فريق إنعاش قلبي رئوي مجهز بالكامل",
      "عناية مركزة ملحقة لاستقرار الحالات الحرجة",
      "سيارات إسعاف مجهزة بأحدث أجهزة الرعاية المركزة"
    ]
  }
];

export const INITIAL_DOCTORS = [
  {
    id: "dr-mohamed-sedky",
    name: "د. محمد صدقي عبدالقادر",
    specialtyId: "cardiology",
    specialtyName: "قلب وباطنة",
    rating: 5.0,
    reviewsCount: 1240,
    tags: ["مدير المستشفى", "استشاري أول", "زميل الجمعية الأمريكية للقلب"],
    featured: true,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    experience: "أكثر من 20 عاماً من الخبرة في أمراض القلب والأوعية الدموية ورعاية الحالات الحرجة.",
    credentials: [
      "دكتوراه أمراض القلب والأوعية الدموية - جامعة القاهرة",
      "زمالة الكلية الأمريكية لأطباء القلب (FACC)",
      "عضو الجمعية الأوروبية لأمراض القلب (ESC)",
      "رئيس قسم القلب والأوعية الدموية بمستشفى القصر العيني (سابقاً)"
    ],
    schedule: {
      days: ["الأحد", "الاثنين", "الأربعاء"],
      hours: ["10:00 ص - 02:00 م", "06:00 م - 09:00 م"]
    }
  },
  {
    id: "dr-ahmed-hassan",
    name: "د. أحمد حسن الرشيدي",
    specialtyId: "orthopedics",
    specialtyName: "عظام",
    rating: 4.9,
    reviewsCount: 840,
    tags: ["أستاذ دكتور", "استشاري جراحة المفاصل"],
    featured: false,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
    experience: "متخصص في جراحات تغيير المفاصل، ومناظير الركبة والكتف، وإصابات الملاعب والكسور المعقدة.",
    credentials: [
      "أستاذ جراحة العظام بجامعة عين شمس",
      "زمالة جراحة المفاصل والكسور - ألمانيا",
      "عضو الجمعية السويسرية لتثبيت الكسور (AO)"
    ],
    schedule: {
      days: ["السبت", "الثلاثاء", "الخميس"],
      hours: ["12:00 م - 04:00 م", "05:00 م - 08:00 م"]
    }
  },
  {
    id: "dr-yasmine-salah",
    name: "د. ياسمين صلاح الدين",
    specialtyId: "pediatrics",
    specialtyName: "أطفال",
    rating: 4.8,
    reviewsCount: 620,
    tags: ["أخصائي أول", "طب الأطفال وحديثي الولادة"],
    featured: false,
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400",
    experience: "خبرة واسعة في تشخيص وعلاج أمراض الأطفال، ومتابعة النمو البدني والذهني والتغذية السليمة.",
    credentials: [
      "ماجستير طب الأطفال وحديثي الولادة - جامعة الإسكندرية",
      "دبلومة التغذية العلاجية للأطفال - الجامعة الأمريكية",
      "عضو الجمعية المصرية لطب الأطفال وحديثي الولادة"
    ],
    schedule: {
      days: ["الأحد", "الثلاثاء", "الأربعاء"],
      hours: ["11:00 ص - 03:00 م", "05:00 م - 08:00 م"]
    }
  },
  {
    id: "dr-mona-abdelaziz",
    name: "د. منى عبد العزيز",
    specialtyId: "obgyn",
    specialtyName: "نساء وتوليد",
    rating: 4.9,
    reviewsCount: 930,
    tags: ["استشاري", "توليد بدون ألم", "تأخر الإنجاب"],
    featured: false,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    experience: "متخصصة في متابعة الحمل الحرج، عمليات الولادة الطبيعية والقيصرية بدون ألم، وجراحات المناظير النسائية.",
    credentials: [
      "دكتوراه أمراض النساء والتوليد - جامعة القاهرة",
      "دبلوم المناظير الجراحية النسائية - فرنسا",
      "عضو الجمعية المصرية لخصوبة المرأة"
    ],
    schedule: {
      days: ["السبت", "الاثنين", "الخميس"],
      hours: ["01:00 م - 05:00 م", "06:00 م - 09:00 م"]
    }
  },
  {
    id: "dr-tarek-mahmoud",
    name: "د. طارق محمود سليمان",
    specialtyId: "dentistry",
    specialtyName: "أسنان",
    rating: 4.7,
    reviewsCount: 450,
    tags: ["أخصائي وزراعة الأسنان", "تجميل الأسنان الرقمي"],
    featured: false,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    experience: "خبرة في زراعة الأسنان الفورية وتصميم الابتسامة الرقمية وعلاج جذور الأسنان بأحدث الميكروسكوبات.",
    credentials: [
      "بكالوريوس طب وجراحة الفم والأسنان - جامعة القاهرة",
      "الزمالة الألمانية في زراعة الأسنان (DGZI)",
      "عضو الجمعية الأمريكية لتجميل الأسنان"
    ],
    schedule: {
      days: ["السبت", "الاثنين", "الأربعاء"],
      hours: ["02:00 م - 08:00 م"]
    }
  },
  {
    id: "dr-khaled-amin",
    name: "د. خالد أمين الهواري",
    specialtyId: "neurology",
    specialtyName: "مخ وأعصاب",
    rating: 4.9,
    reviewsCount: 510,
    tags: ["استشاري أول", "أمراض السكتة الدماغية"],
    featured: false,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    experience: "متخصص في أمراض الصداع المزمن، الصرع، التصلب المتعدد، واضطرابات الحركة والاتزان.",
    credentials: [
      "دكتوراه أمراض المخ والأعصاب - جامعة عين شمس",
      "زمالة السكتة الدماغية والجلطات - جامعة إيموري (أمريكا)",
      "عضو الأكاديمية الأمريكية للأعصاب (AAN)"
    ],
    schedule: {
      days: ["الاثنين", "الثلاثاء", "الخميس"],
      hours: ["04:00 م - 09:00 م"]
    }
  }
];

export const INITIAL_SLIDES = [
  {
    id: 1,
    title: "رعاية طبية بمعايير عالمية لكل عائلة",
    subtitle: "تلتزم مستشفى Family Health Care بتقديم أعلى مستويات الرعاية الصحية في مدينة 6 أكتوبر باستخدام أحدث الأساليب العلاجية والتكنولوجية لضمان سلامة وصحة أسرتك.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
    ctaText: "احجز موعدك الآن",
    ctaLink: "/book"
  },
  {
    id: 2,
    title: "نخبة من كبار الاستشاريين وأساتذة الجامعات",
    subtitle: "نضم فريقاً متكاملاً من الأطباء المتخصصين في كافة المجالات الطبية لتقديم الرعاية المثالية تحت قيادة وإشراف د. محمد صدقي عبدالقادر.",
    image: "https://images.unsplash.com/photo-1582750433449-64c656fb19f0?auto=format&fit=crop&q=80&w=1200",
    ctaText: "تعرف على أطبائنا",
    ctaLink: "/doctors"
  },
  {
    id: 3,
    title: "طوارئ ورعاية متكاملة 24 ساعة طوال أيام الأسبوع",
    subtitle: "غرفة طوارئ مجهزة على أعلى مستوى لاستقبال الحوادث والحالات الحرجة فوراً بوجود طاقم طبي متأهب وسيارات إسعاف مجهزة بالكامل.",
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=1200",
    ctaText: "اتصل بنا فوراً",
    ctaLink: "/contact"
  }
];

export const INITIAL_ABOUT_SECTIONS = {
  story: "تأسست مستشفى Family Health Care في عام 2009 في قلب مدينة 6 أكتوبر بمحافظة الجيزة، بهدف سد الفجوة في الخدمات الطبية المتميزة وتقديم نموذج مبتكر يدمج بين الرعاية الصحية الاحترافية بمعايير عالمية ولمسة الدفء والاهتمام العائلي. بدأنا كمركز طبي صغير متخصص في أمراض القلب والأوعية الدموية تحت إدارة د. محمد صدقي عبدالقادر، وتطورنا سريعاً بفضل ثقة مرضانا لنصبح صرحاً طبياً متكاملاً يضم أكثر من 12 تخصصاً طبياً، ومختبراً مركزياً، وقسماً للأشعة التشخيصية، وطوارئ تعمل على مدار الساعة.",
  mission: "تقديم خدمات طبية آمنة وذات جودة استثنائية لجميع أفراد الأسرة، ترتكز على الرحمة، الاحترافية، والابتكار، مع الالتزام بأعلى المعايير الأخلاقية والمهنية العالمية لبناء مجتمع أكثر صحة وعافية.",
  vision: "أن نكون الخيار الأول والوجهة الصحية الأكثر موثوقية للعائلات في مصر والشرق الأوسط، وأن نحقق الريادة في الرعاية الطبية الشخصية والحلول العلاجية المبتكرة.",
  values: [
    { title: "الرحمة والاهتمام", desc: "نضع راحة مريضنا وسلامته النفسية والجسدية في مقدمة أولوياتنا دائماً." },
    { title: "التميز والجودة", desc: "نلتزم بأحدث البروتوكولات العلاجية العالمية وتطبيق أعلى معايير الجودة ومكافحة العدوى." },
    { title: "الأمانة والنزاهة", desc: "نبني علاقات طويلة الأمد مع مرضانا تقوم على الصدق، والشفافية التامة، واحترام خصوصية المريض." },
    { title: "العمل الجماعي", desc: "نتعاون كفريق متكامل يتبادل المعرفة لتقديم رعاية شاملة ومتناسقة للمريض." }
  ],
  timeline: [
    { year: "2009", title: "البداية والتأسيس", desc: "تأسيس المستشفى كمركز تخصصي لرعاية مرضى القلب والأوعية الدموية في مدينة 6 أكتوبر." },
    { year: "2013", title: "التوسع الأول للأقسام", desc: "افتتاح أقسام الباطنة والأطفال والنساء والتوليد وتجهيز غرف العمليات الصغرى." },
    { year: "2018", title: "افتتاح الطوارئ والمختبر", desc: "تجهيز قسم الطوارئ 24/7 وافتتاح المختبر المركزي وقسم الأشعة التشخيصية الحديث." },
    { year: "2022", title: "التحول الرقمي الكامل", desc: "تطبيق نظام الملفات الطبية الإلكترونية الموحد للمرضى، وتدشين خدمات الحجز والاستشارات الذكية." },
    { year: "2025", title: "رؤية المستقبل والتميز", desc: "وصول عدد الكادر الطبي لأكثر من 20 طبيباً متخصصاً، وخدمة ما يزيد عن 8000 مريض بنسبة رضا بلغت 98%." }
  ]
};

export const DEFAULT_SETTINGS = {
  hospitalName: "Family Health Care Hospital",
  logoText: "Family Health Care",
  primaryColor: "#2a9db5", // Teal
  secondaryColor: "#5aab6b", // Green
  darkColor: "#1c2b35", // Navy
  phone: "+20 2 3800 0000",
  emergencyPhone: "19999",
  whatsapp: "+20 100 123 4567",
  address: "المجاورة الثالثة، الحي المتميز، مدينة 6 أكتوبر، الجيزة، مصر",
  mapsUrl: "https://goo.gl/maps/xyzHospital6October",
  mapsEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55279.790938446654!2d30.916792694158428!3d29.979854497491375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14585642a8a8163f%3A0xe5a363ee0f7b0c3d!2zNnRoIG9mIE9jdG9iZXIsIEdpemEgR292ZXJub3JhdGU!5e0!3m2!1sen!2seg!4v1716300000000!5m2!1sen!2seg",
  stats: {
    experience: "+15 سنة خبرة",
    patients: "+8000 مريض",
    doctors: "+20 طبيب",
    satisfaction: "98% رضا المرضى"
  }
};

export const INITIAL_BOOKINGS = [
  {
    id: "FHH-2026-8092",
    patientName: "أحمد محمود العشري",
    phone: "01099887766",
    age: "45",
    specialtyId: "cardiology",
    specialtyName: "قلب وباطنة",
    doctorId: "dr-mohamed-sedky",
    doctorName: "د. محمد صدقي عبدالقادر",
    date: "2026-05-24",
    time: "06:30 م",
    notes: "متابعة دورية لضغط الدم وحالة صمامات القلب.",
    status: "confirmed", // pending, confirmed, cancelled
    createdAt: "2026-05-20T14:32:00Z"
  },
  {
    id: "FHH-2026-4421",
    patientName: "نادية عبد الرحمن كريم",
    phone: "01223344556",
    age: "31",
    specialtyId: "obgyn",
    specialtyName: "نساء وتوليد",
    doctorId: "dr-mona-abdelaziz",
    doctorName: "د. منى عبد العزيز",
    date: "2026-05-25",
    time: "01:30 م",
    notes: "متابعة السونار الدوري للحمل بالشهر الخامس.",
    status: "pending",
    createdAt: "2026-05-21T09:15:00Z"
  },
  {
    id: "FHH-2026-1189",
    patientName: "يوسف عمر الشاذلي",
    phone: "01556677889",
    age: "8",
    specialtyId: "pediatrics",
    specialtyName: "أطفال",
    doctorId: "dr-yasmine-salah",
    doctorName: "د. ياسمين صلاح الدين",
    date: "2026-05-24",
    time: "11:30 ص",
    notes: "ارتفاع طفيف في درجات الحرارة وكحة مستمرة منذ يومين.",
    status: "confirmed",
    createdAt: "2026-05-21T11:00:00Z"
  }
];

export const INITIAL_USERS = [
  {
    id: "admin-1",
    username: "superadmin",
    name: "المدير العام للمستشفى",
    role: "superadmin",
    password: "admin"
  },
  {
    id: "reception-1",
    username: "reception",
    name: "قسم الاستقبال والملفات",
    role: "receptionist",
    password: "reception"
  },
  {
    id: "doctor-sedky",
    username: "drsedky",
    name: "د. محمد صدقي",
    role: "doctor",
    password: "sedky",
    doctorId: "dr-mohamed-sedky"
  }
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: "rx-9801",
    bookingId: "FHH-2026-8092",
    patientName: "أحمد محمود العشري",
    phone: "01099887766",
    doctorId: "dr-mohamed-sedky",
    doctorName: "د. محمد صدقي عبدالقادر",
    date: "2026-05-20",
    diagnosis: "ارتفاع طفيف في ضغط الدم مع إجهاد عضلي بسيط",
    medicines: [
      { name: "Concor 5mg", dosage: "قرص واحد", frequency: "مرة واحدة يومياً صباحاً", period: "لمدة شهر" },
      { name: "Panadol Joint 665mg", dosage: "قرصين", frequency: "عند اللزوم بعد الأكل", period: "لمدة أسبوع" },
      { name: "Cardiprin 100mg", dosage: "قرص واحد", frequency: "مرة واحدة بعد الغداء", period: "مستمر" }
    ],
    notes: "يرجى تقليل تناول الملح والدهون، وإجراء تحليل وظائف الكلى وتكرار الزيارة بعد أسبوعين."
  }
];

export const INITIAL_REPORTS = [
  {
    id: "rep-5012",
    bookingId: "FHH-2026-8092",
    patientName: "أحمد محمود العشري",
    phone: "01099887766",
    doctorId: "dr-mohamed-sedky",
    doctorName: "د. محمد صدقي عبدالقادر",
    type: "lab",
    title: "تحليل وظائف كلى ونسبة أملاح بالدم",
    date: "2026-05-21",
    resultText: "نسبة البولينا في الدم (Urea): 35 mg/dL (طبيعي: 15-45)\nنسبة الكرياتينين (Creatinine): 0.9 mg/dL (طبيعي: 0.6-1.2)\nنسبة حمض البوليك (Uric Acid): 6.8 mg/dL (طبيعي: 3.5-7.2)",
    status: "ready",
    notes: "النتائج طبيعية وفي الحدود الآمنة. ينصح بشرب كميات كافية من الماء يومياً."
  },
  {
    id: "rep-5013",
    bookingId: "FHH-2026-8092",
    patientName: "أحمد محمود العشري",
    phone: "01099887766",
    doctorId: "dr-mohamed-sedky",
    doctorName: "د. محمد صدقي عبدالقادر",
    type: "radiology",
    title: "أشعة موجات فوق صوتية على البطن والحوض",
    date: "2026-05-21",
    resultText: "الكبد: حجم طبيعي ولا يوجد دهون مترسبة.\nالمرارة: سليمة وجدارها طبيعي وخالية من الحصوات.\nالكليتان: الحجم طبيعي ولا توجد حصوات أو انسداد.\nالمثانة: سليمة وممتلئة بشكل جيد.",
    status: "ready",
    notes: "تقرير طبي سليم ولا يوجد أي علامات مرضية."
  }
];

