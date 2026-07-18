const YEN_SAO_DB = {
    products: [
        {
            id: "yen-tho",
            name: "Yến Thô Tự Nhiên",
            tag: "Nguyên bản",
            description: "Yến nguyên tổ từ hang đảo, 100% tự nhiên.",
            stars: 5,
            reviews: 128,
            price: 3500000,
            original_price: 4000000,
            image: "./assets/images/yen-tinh-che.webp",
            features: ["Nguyên tổ 100%", "Nở gấp 4-5 lần", "Giữ vi chất tối đa"],
            variantConfig: {
                type: "select_with_custom",
                options: [
                    { value: "3-to", label: "Hộp 3 tổ" },
                    { value: "6-to", label: "Hộp 6 tổ" },
                    { value: "12-to", label: "1 Hộp 12 tổ (1 lạng)" },
                    { value: "24-to", label: "2 Hộp 12 tổ (2 lạng)" },
                    { value: "custom", label: "Số lượng khác..." }
                ],
                customLabel: "Nhập số lượng (tổ hoặc gram):",
                customPlaceholder: "Ví dụ: 50 tổ hoặc 500g"
            }
        },
        {
            id: "yen-tuoi",
            name: "Yến Tươi Cao Cấp",
            tag: "Tiện lợi",
            description: "Thu hoạch và làm sạch thủ công, đóng gói ngay trong ngày.",
            stars: 4.8,
            reviews: 95,
            price: 1500000,
            original_price: 1800000,
            image: "./assets/images/yen-hop.webp",
            features: ["Đã làm sạch 100%", "Bảo quản lạnh", "Tiết kiệm thời gian"],
            variantConfig: {
                type: "select_with_custom",
                options: [
                    { value: "50g", label: "50 gam" },
                    { value: "100g", label: "100 gam" },
                    { value: "200g", label: "200 gam" },
                    { value: "custom", label: "Số lượng khác..." }
                ],
                customLabel: "Nhập số gam:",
                customPlaceholder: "Ví dụ: 300 gam"
            }
        },
        {
            id: "yen-tinh-che",
            name: "Yến Tinh Chế Ép Tổ",
            tag: "Bestseller",
            description: "Đã làm sạch lông, định hình tổ đẹp, thích hợp biếu tặng.",
            stars: 5,
            reviews: 215,
            price: 4200000,
            original_price: 4500000,
            image: "./assets/images/yen-hop.webp",
            features: ["Sạch lông 100%", "Sợi dài dai ngon", "Mẫu mã sang trọng"],
            variantConfig: {
                type: "select_with_custom",
                options: [
                    { value: "3-to", label: "Hộp 3 tổ" },
                    { value: "6-to", label: "Hộp 6 tổ" },
                    { value: "12-to", label: "1 Hộp 12 tổ (1 lạng)" },
                    { value: "24-to", label: "2 Hộp 12 tổ (2 lạng)" },
                    { value: "custom", label: "Số lượng khác..." }
                ],
                customLabel: "Nhập số lượng (tổ):",
                customPlaceholder: "Ví dụ: 50 tổ"
            }
        },
        {
            id: "yen-chung-san",
            name: "Hũ Yến Chưng Sẵn",
            tag: "Dùng ngay",
            description: "Tiện lợi, chưng sẵn đường phèn, táo đỏ, hạt sen.",
            stars: 4.9,
            reviews: 320,
            price: 850000,
            original_price: 950000,
            image: "./assets/images/yen-hu.webp",
            features: ["Mở nắp dùng ngay", "Kết hợp thảo mộc", "Thơm ngon bổ dưỡng"],
            variantConfig: {
                type: "number_input",
                label: "Số lượng hũ:",
                placeholder: "Ví dụ: 6",
                note: "Lưu ý: Chỉ nhận giao hàng từ 4 hũ trở lên."
            }
        }
    ]
};
