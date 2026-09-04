export interface BookLocaleData {
  title: string;
  image: string;
  alt: string;
  amazonUrl: string;
}

export interface Book {
  id: string;
  en: BookLocaleData;
  ar: BookLocaleData;
}

export const books: Book[] = [
  {
    id: "business-developer",
    en: {
      title: "The Business Developer’s Mindset",
      image: "/images/books/business-developers-mindset-en.png",
      alt: "The Business Developer’s Mindset book cover",
      amazonUrl:
        "https://www.amazon.com/Business-Developers-Mindset-Strategies-Organizations-ebook/dp/B0GZJ8XSL7/ref=sr_1_2?dib=eyJ2IjoiMSJ9.bR5OSQM4xDW6J3AIItx9orDkccXTPkABjFb2w-KnqH5D2HYyva-84ir_qDa1zT9B2ykrhVM3nofF-PAWLC_ebx6fLsyURNT-xAVAaCnneNo.HbyaJg1spt8TvEdlE0-PlukazzWJP_ea_dM2tXgUUUI&dib_tag=se&qid=1778309556&refinements=p_27%3ADr.%2BKhaled%2B%2BAlmohamad&s=digital-text&sr=1-2&text=Dr.%2BKhaled%2B%2BAlmohamad",
    },
    ar: {
      title: "عقلية مطور الأعمال",
      image: "/images/books/business-developers-mindset-ar.png",
      alt: "غلاف كتاب عقلية مطور الأعمال",
      amazonUrl:
        "https://www.amazon.com/dp/B0H11YGJXR/ref=sr_1_3?dib=eyJ2IjoiMSJ9.bR5OSQM4xDW6J3AIItx9orDkccXTPkABjFb2w-KnqH5D2HYyva-84ir_qDa1zT9B2ykrhVM3nofF-PAWLC_ebx6fLsyURNT-xAVAaCnneNo.HbyaJg1spt8TvEdlE0-PlukazzWJP_ea_dM2tXgUUUI&dib_tag=se&qid=1778309556&refinements=p_27%3ADr.+Khaled++Almohamad&s=digital-text&sr=1-3&text=Dr.+Khaled++Almohamad",
    },
  },
  {
    id: "customer-effect",
    en: {
      title: "The Customer Effect",
      image: "/images/books/customer-effect-en.png",
      alt: "The Customer Effect book cover",
      amazonUrl:
        "https://www.amazon.com/dp/B0GZB21XYD/ref=sr_1_1?dib=eyJ2IjoiMSJ9.bR5OSQM4xDW6J3AIItx9orDkccXTPkABjFb2w-KnqH5D2HYyva-84ir_qDa1zT9B2ykrhVM3nofF-PAWLC_ebx6fLsyURNT-xAVAaCnneNo.HbyaJg1spt8TvEdlE0-PlukazzWJP_ea_dM2tXgUUUI&dib_tag=se&qid=1778309556&refinements=p_27%3ADr.+Khaled++Almohamad&s=digital-text&sr=1-1&text=Dr.+Khaled++Almohamad",
    },
    ar: {
      title: "أثر العميل",
      image: "/images/books/customer-effect-ar.png",
      alt: "غلاف كتاب أثر العميل",
      amazonUrl:
        "https://www.amazon.com/dp/B0GXH3H1NF/ref=sr_1_6?dib=eyJ2IjoiMSJ9.bR5OSQM4xDW6J3AIItx9orDkccXTPkABjFb2w-KnqH5D2HYyva-84ir_qDa1zT9B2ykrhVM3nofF-PAWLC_ebx6fLsyURNT-xAVAaCnneNo.HbyaJg1spt8TvEdlE0-PlukazzWJP_ea_dM2tXgUUUI&dib_tag=se&qid=1778309556&refinements=p_27%3ADr.+Khaled++Almohamad&s=digital-text&sr=1-6&text=Dr.+Khaled++Almohamad",
    },
  },
  {
    id: "why-people-buy",
    en: {
      title: "Why People Buy?",
      image: "/images/books/why-people-buy-en.png",
      alt: "Why People Buy? book cover",
      amazonUrl:
        "https://www.amazon.com/dp/B0GXGRYL19/ref=sr_1_5?dib=eyJ2IjoiMSJ9.bR5OSQM4xDW6J3AIItx9orDkccXTPkABjFb2w-KnqH5D2HYyva-84ir_qDa1zT9B2ykrhVM3nofF-PAWLC_ebx6fLsyURNT-xAVAaCnneNo.HbyaJg1spt8TvEdlE0-PlukazzWJP_ea_dM2tXgUUUI&dib_tag=se&qid=1778309556&refinements=p_27%3ADr.+Khaled++Almohamad&s=digital-text&sr=1-5&text=Dr.+Khaled++Almohamad",
    },
    ar: {
      title: "لماذا يشتري الناس؟",
      image: "/images/books/why-people-buy-ar.png",
      alt: "غلاف كتاب لماذا يشتري الناس؟",
      amazonUrl:
        "https://www.amazon.com/dp/B0GXPL8W9R/ref=sr_1_4?dib=eyJ2IjoiMSJ9.bR5OSQM4xDW6J3AIItx9orDkccXTPkABjFb2w-KnqH5D2HYyva-84ir_qDa1zT9B2ykrhVM3nofF-PAWLC_ebx6fLsyURNT-xAVAaCnneNo.HbyaJg1spt8TvEdlE0-PlukazzWJP_ea_dM2tXgUUUI&dib_tag=se&qid=1778309556&refinements=p_27%3ADr.+Khaled++Almohamad&s=digital-text&sr=1-4&text=Dr.+Khaled++Almohamad",
    },
  },
];
