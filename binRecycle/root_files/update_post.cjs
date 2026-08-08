const fs = require('fs');

const imageUrls = [
  "https://sites.google.com/sitesv-images-rt/ACHe0d05jtmN6uEhCfJKAhm3ratuhoHLiwwT5ryAsWxTMnx-eSFC46Irr4TFmuRTlmxdRyZbh1a3uKNmngyu9pjbaRhoWLyua__xsET0_CkQsKSu8hj0O2KhSG2WT3606-1v2Wlh67LQx9kVHPTiLG6kehC-5SzHnM_9KxN45zYEZU49SHz_brRiehZqy8R-2-ECieCx1AkpoHdgR0_vsA2El21UZQ",
  "https://sites.google.com/sitesv-images-rt/ACHe0d3kvpfFWyydYSH0kVAbETW3HKNkdThz1QEYaqQegb0uGp2c4HyIiUuh8673eIzqivIcIZ5wPzPmWmqMbkomD5dV5J69eKsHHIXcYZ73IN3HnAmArmYtw8MR1ITk0f3lwdJ3dxanUO0B_2gAqchhR_Zkw9hUE_RYoMxVCVJ8mmFvgibU8DQ8rLyqT7-VMKF60vPPzUfI_ryK8_V73o1OaLY6OFZJkTx6rH4RjYJtgS4=w1280",
  "https://sites.google.com/sitesv-images-rt/ACHe0d28PECTqf0cD_B6Z2VhtY3M22QOYU9WK0W6yTZMNcSLFPJ9MF_AAALeCY72Ol-DIeTUNE0EM_CXHa5ItgSyIkPLUeUZDZpqdArN9stfzQqYh7ArZyrul29ZIxyrVMUak8WF7Qt0MqmknmR6HlKB3daAPmOpMFJiUGiRa9dYSPe6JmmRgq74RjaQt_mP3rZARZ2mnLnuw5jjRjBXrSH8Prg5M9BpLTN-1fgdx6UaN-0=w1280",
  "https://sites.google.com/sitesv-images-rt/ACHe0d2KBaWG8BydJtzL4UwfclJ-Ydw2_49K8dZAI5r4EUcauIs3Hilx727SKaaG4OKtm5qukvcYyV4kdpWff-Yp81wqiKt7UPB0DU5LGJMuaDo87HLyI15kUWR4dmeuDOVz5h9rgT_S03NgfJFAvij9UD6NchA0VT7i8znwUD9nnGgz5HGyJQ1TSPhtBvM-0E-kfh42v4GJq9jNn6vf4IeVlArw_BfpoNEe7uHPjC3S=w1280",
  "https://sites.google.com/sitesv-images-rt/ACHe0d2PkT5DdBEFU6pbENL9yu6MleFIRUzEC-Wo8C331V9vIXB_3Kssa1yFSQnVM_k82zf5OZHQVhupKF2o6_97gc1JeE-VYdjPOXWalGlvI7KgOlrGVTTkKDlaiC30ut1SGmkCWkcgHUk3-xgpzSoEHQeKeQ5zoglYzlR6bzxtjxJMRlrtqZBBmDgHF2uykFGYdW7mHhUOv1FHcOna4f72uLBc_indIvtlH7UM5eejFzk=w1280",
  "https://sites.google.com/sitesv-images-rt/ACHe0d0yxCWgJPcw5v7lxGgv4_QjT76eiVhQVb2dE8vmIsTbIhb0NzzAJ7COwoyfc8Iz2WQbvbezASYjktZyM-UU6VJpc9w3FejvfxK22-rI4mZSZbFfl-22_Kd7FamptRSqU1UmV7SlqW8bbtxxw2wRPzAIPVSawRgXk9wMdZtvPeKSP34kIY_NdWhbMkXdByp-jdF7gRWZkAfiiYA_HbB60UWQmXJFgkAw6T1C7fMi-fA=w1280",
  "https://sites.google.com/sitesv-images-rt/ACHe0d1vujs-YKQ3k3WlG7XeEsnEAJ21dFq_GPyrya2L-MykvlJ73Uoov9FICHvNceGh3mdCKyFr3LIk-yO7CDrI3XVLVIFgaQaAJB_m1ob8e71EoQOeQA2mydXcOc-8AtOrZc8BqQgCWUtUTdZ52ULFEBg0r7MMDeC4a2nJ4XNIGA707TRFOBWz_CYEV3WAPAPdMH6ubm8PKGkz2Yz8DaDMkg2Po4xYb9BkKTiuoKegzu8=w1280",
  "https://sites.google.com/sitesv-images-rt/ACHe0d2qsbqIffAq6QOw-NXsGih4rt8HPt30earS-xr1gH6gIBX7uGU7wHvygHDHX2Jn_g5Vfc6RI_kHRdNH795LWdvuMlXmEPFqJ7KkYQJTTWV-zz07jxb9CCLIWaqWBMv4YCONLL3j2nCWYnxZCee-2FzPd84Y01V4Z4HCtqXa-uIUqRxAz37q4_HDkS1k_7UvLTszzxPAJSeICjQ5EzIl1dLN__S2ckTkhF4UiDs9Dv8=w1280",
  "https://sites.google.com/sitesv-images-rt/ACHe0d1NnnNmwWXhGSOKwkwHFc_1xRW9JpbO0DwBA5TiYS44ZJySGoFHyNQMfwodCNHbgOVj6ZH6uzNMxJZ6nGXIA2QL8B3V94KuHYc3LqhvxXpfLeleHQSYuntC4k_rBSMg4CYLDKW8g9ZIwbKjbjKSDiqsCmDEco-hGbWUw_f1t6-cBemhvyaQJz5TUSeVeojyQZJ4K_WoiMEXxMilj69qzTv5v-UiNGM15uxnPAHk77Q=w1280",
  "https://sites.google.com/sitesv-images-rt/ACHe0d3LZhbP_y6cY23_EZk1cqujLNMsJBUX5D-jYK8elH2XxZB9Xuv3gne1SLL9XwIT-jb5w3gzojiVQOlZDm28vsMA5Zf57__qewyTxYTELj7xJniUtMSiDNqcTn8dCG1Jfu8W64hL2EzSZzd_Hk2dGHt0_5fIiR1HIxJZLAy8aeg53C-wF33cShCZU6iNEkKCK3aYYg55I_QbZTSoGrAteAWKdKRIpx-XEfxipb0w=w1280"
];

const imgTemplate = (url) => `<p><img src="${url}" alt="Đầm Thị Nại" style="width:100%; border-radius:8px; margin: 15px 0;"></p>`;

const jsonPath = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\data\\posts\\dam-thi-nai.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let contentStr = data.content;

// Insert first image after the first paragraph
contentStr = contentStr.replace(/<\/p>/, `</p>${imgTemplate(imageUrls[0])}`);

// Insert remaining images before <h2> tags
const parts = contentStr.split('<h2>');
let newContent = parts[0];

let imgIdx = 1;
for (let i = 1; i < parts.length; i++) {
    if (imgIdx < imageUrls.length) {
        newContent += `${imgTemplate(imageUrls[imgIdx])}<h2>${parts[i]}`;
        imgIdx++;
    } else {
        newContent += `<h2>${parts[i]}`;
    }
}

// Insert any remaining images at the end of lists if any
if (imgIdx < imageUrls.length) {
    const listParts = newContent.split('</li>');
    let finalContent = listParts[0];
    for (let i = 1; i < listParts.length; i++) {
        if (imgIdx < imageUrls.length && i % 2 === 0) { // spread them a bit
             finalContent += `</li>${imgTemplate(imageUrls[imgIdx])}${listParts[i]}`;
             imgIdx++;
        } else {
             finalContent += `</li>${listParts[i]}`;
        }
    }
    newContent = finalContent;
}

data.content = newContent;
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Update successful!');
