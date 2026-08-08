const fs = require('fs');
const path = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\data\\posts\\phan-biet-yen-that-gia.json';

const contentHTML = `
<p>Tổ yến vốn được biết đến là 1 loại thực phẩm với mức giá rất cao và có chứa lượng dưỡng chất dồi dào cực kì tốt cho cơ thể. Thế nhưng hiện nay lại có rất nhiều tổ yến giả đang được bày bán trên thị trường. Nhân đây, hãy cùng chuyên mục Mẹo vào bếp xem qua cách phân biệt yến thật và giả nhé!</p>

<h2>1. Tổ yến tinh chế được làm giả như thế nào?</h2>
<p>Tổ yến hay còn được biết đến với cái tên quen thuộc khác là yến sào, đây là 1 loại thực phẩm được làm nên từ tổ chim yến quý hiếm, nổi tiếng cực kì tốt cho cơ thể. Do đó, không quá khó hiểu khi tổ yến được bán với mức giá cao.</p>
<p>Chính vì lẽ đó mà dẫn đến tình trạng hiện nay làm giả và pha trộn tổ yến xảy ra rất nhiều. Với tổ yến thô chưa qua sơ chế, người ta sẽ tiến hành trộn cùng rau câu, mủ trôm để làm giả. Tuy nhiên, cách làm này rất dễ bị phát hiện sau khi được ngâm nước hoặc chưng nấu.</p>
<p>Ngoài ra, họ còn có thể pha trộn thêm da cá, nấm, tảo,... rất tinh vi để làm yến sào nặng hơn so với ban đầu. Hay còn có 1 cách thông dụng khác mà chúng ta rất khó nhận ra đó là trộn cùng các chất phụ gia như đường, muối hoặc chất kết dính.</p>

<p><img src="./assets/images/yen-tinh-che.webp" alt="Tổ yến tinh chế" style="width:100%; border-radius:8px; margin: 15px 0;"></p>

<h2>2. Cách phân biệt tổ yến thật</h2>

<h3>Nếm thử</h3>
<p><strong>Yến thật:</strong> Cách thông dụng, dễ dàng nhất để kiểm tra tổ yến chính là bằng cách nếm thử. Chỉ cần lấy 1 sợi yến nhỏ rồi tiến hành nếm thử, nếu thấy không quá ngọt, đồng thời cảm giác có vị tựa như lòng trắng trứng thì đó chính là yến thật.</p>
<p><strong>Yến giả:</strong> Tuy rằng việc trộn đường vào yến có khả năng tạo chất kết dính tốt để tổ yến đẹp mắt và còn có thể hạn chế nấm mốc sinh sôi sẽ bảo quản lâu hơn, nhưng vẫn không thể phủ nhận việc này sẽ gây ảnh hưởng cực kì tới cơ thể nếu sử dụng trong thời gian lâu dài. Do đó, khi nếm thử nếu cảm giác có vị ngọt, thì đây hoàn toàn là dấu hiệu cho thấy bạn đã mua nhầm tổ yến kém chất lượng.</p>

<h3>Kiểm tra sơ bộ</h3>
<p><strong>Yến thật:</strong> Đối với yến thật, cho dù bạn có để lâu ở ngoài không khí thì cũng không làm mất độ giòn của yến. Khi cầm lên sẽ cảm thấy yến rất dễ vỡ, không có độ dẻo.</p>
<p><strong>Yến giả:</strong> Còn với yến giả do đã được trộn lẫn các phụ gia nên khi để lâu ngoài không khí bạn sẽ thấy yến có độ dẻo, đồng thời rất khó bể và trông khá cứng.</p>

<h3>Kiểm tra bằng độ đàn hồi</h3>
<p><strong>Yến thật:</strong> Ngoài những cách trên, thì bạn còn có thể kiểm tra bằng cách bóp nhẹ vào yến. Nếu thấy yến có độ giòn, đồng thời dễ gãy thì đó là dấu hiệu cho thấy yến thật.</p>
<p><strong>Yến giả:</strong> Tuy nhiên, với yến giả do đã được trộn thêm các chất khác cho nên bạn sẽ cảm giác được yến có độ mềm và đặc biệt còn có độ đàn hồi.</p>

<h3>Ngâm nước</h3>
<p><strong>Yến thật:</strong> Một cách dễ dàng khác để kiểm tra tổ yến vẫn thường được mọi người sử dụng đó là tiến hành ngâm tổ yến với nước sạch khoảng 30 phút. Khi thấy yến đã nở, thì lúc đó bạn quan sát nếu những sợi yến vẫn giữ được màu sắc như ban đầu, không hề bị đổi màu, đặc biệt ngửi thấy mùi tanh đặc trưng của yến như lòng trắng trứng và hơi mốc nhẹ thì đó hoàn toàn là yến nguyên chất.</p>
<p><strong>Yến giả:</strong> Còn sau khi ngâm 30 phút mà yến lại bị hòa tan cùng nước, đồng thời chuyển sang những màu lạ thường khác và tỏa ra mùi hôi lạ từ các chất phụ gia thì không cần suy nghĩ nữa bởi đấy chính là yến giả.</p>

<p><img src="./assets/images/yen-hop.webp" alt="Tổ yến" style="width:100%; border-radius:8px; margin: 15px 0;"></p>

<h3>Đem chưng</h3>
<p><strong>Yến thật:</strong> Ngoài ra, còn có thể đem chưng tổ yến để phân biệt 1 cách rõ ràng nhất. Với cách này thì bạn chỉ cần lấy 1 lượng vừa đủ để thử chứ không cần sử dụng quá nhiều. Vì hiện nay tình trạng làm giả tổ yến rất tinh vi, cho nên tốt nhất nên tiến hành hấp cách thủy khoảng 15 - 30 phút để xác định chính xác hơn. Nếu thấy tổ yến sau khi hấp không bị tan ra mà vẫn giữ được những sợi yến như ban đầu thì đó chính là yến thật.</p>
<p><strong>Yến giả:</strong> Còn với yến giả, thì chỉ cần 2 - 3 phút sau khi hấp, bạn sẽ thấy yến thay đổi hình dạng so với ban đầu, ngoài ra do được làm từ tinh bột nên yến sẽ lập tức bị nhão ra ngay.</p>

<h3>Sử dụng dung dịch Luigon / Muối iot</h3>
<p><strong>Yến thật:</strong> Ngoài dung dịch iot, thì dung dịch Luigon cũng là 1 loại thuốc chuyên về việc xác định tổ yến thật hay giả. Bằng cách bắc nồi lên bếp cùng 1 ít tổ yến, tiến hành đun đến khi hỗn hợp sôi. Sau đó, nhỏ vào 1 vài giọt dung dịch Luigon (hoặc Iot), nếu thấy nồi nước vẫn bình thường, không hề xảy ra bất kì hiện tượng, phản ứng nào tức đó là yến thật.</p>
<p><strong>Yến giả:</strong> Khi nhỏ dung dịch Luigon vào mà bạn thấy hỗn hợp lập tức chuyển sang màu xanh, nhưng khi để nguội thì nó trở về trạng thái như ban đầu thì đó chính là yến giả, kém chất lượng. Trái lại, nếu thấy hỗn hợp ngả sang màu xanh khi dùng Iot thì không cần phải đắn đo nữa, đây chính là yến kém chất lượng.</p>

<h3>Sử dụng lửa để đốt</h3>
<p><strong>Yến thật:</strong> Việc sử dụng lửa đốt thử yến cũng là 1 cách làm để xác định được yến thật hay giả đơn giản mà mọi người ai cũng làm được. Khi thấy tổ yến tiếp xúc với lửa mà cháy tự nhiên, đồng thời không hề có các tia lửa hay bụi than rơi xuống quá nhiều thì đó là yến thật.</p>
<p><strong>Yến giả:</strong> Ngược lại, tổ yến giả sẽ lập tức xuất hiện các tia lửa, đặc biệt còn ngửi thấy mùi khét và các bụi than thì rất nhiều.</p>

<h3>Thông qua màu sắc & hình dáng</h3>
<p><strong>Yến thật:</strong> Hiện nay, trên thị trường chủ yếu bày bán rộng rãi 3 loại gồm: Yến huyết (đỏ), Yến hồng (hồng nhạt), Yến trắng (trắng đục). Khi cầm tổ yến trên tay cảm giác nhẹ, đồng thời có độ dày, đặc biệt các sợi yến đan xen vào nhau có thể tạo thành hình vòng cung. Nhìn về phía đáy thì thấy có màu vàng đen.</p>
<p><strong>Yến giả:</strong> Nếu muốn kiểm tra yến bằng màu sắc, bạn chỉ cần đem ra nơi có ánh sáng, nếu thấy tổ yến trong suốt mà còn phản quang được thì tức đó là yến giả. Còn đối với tổ yến giả, do được trộn cùng đường, tinh bột nên các sợi yến trông không chân thực, thiếu tự nhiên, các sợi đan xen vào nhau rất chặt chẽ và cũng mền mịn hơn yến thật rất nhiều.</p>

<h2>3. Yến giả làm từ gì?</h2>
<ul>
<li><strong>Làm từ rong biển:</strong> Do được làm từ rong biển, nên yến giả đa phần đều có vị mặn của rong biển chứ không hề mang vị đặc trưng của yến. Ngoài ra, khi cầm lên bạn dễ dàng thấy được yến giả từ rong biển rất chắc tay và có độ mềm mịn. Đồng thời, sau khi được chế biến thì các sợi yến cũng trở nên rất to và thô.</li>
<li><strong>Làm từ Agar (bột rau câu):</strong> Sau khi trải qua quá trình chưng cách thủy, thì các yến sẽ nở ra trông rất đẹp mắt. Tuy nhiên, nếu để qua đêm thì các sợi yến cũng nở ra và hòa tan với nước ngay lập tức. Một điểm lưu ý khác với loại yến giả làm từ Agar chính là chén nước sẽ bị vẩn đục chứ không còn trong suốt như ban đầu.</li>
<li><strong>Làm từ Gelatin bì heo:</strong> Khi chuẩn bị mua tổ yến mà bạn thấy những người bán hàng tư vấn thời gian chế biến lên đến 4 tiếng thì đó chính là yến giả làm từ Gelatin bì heo, bởi thực chất yến thật chỉ mất có 30 - 40 phút mà thôi! Tuy rằng sau khi chưng cách thủy thì sợi yến vẫn nở ra, thế nhưng quan sát kĩ mới thấy chúng lại trông rất chai sần và không có độ mịn màng.</li>
</ul>

<h2>4. Các loại yến giả</h2>
<ul>
<li><strong>Huyết yến được làm giả từ bạch yến:</strong> Loại yến huyết đắt đỏ là loại được làm giả nhiều nhất trên thị trường hiện nay, đa phần 90% yến huyết được bày bán đều là yến được làm giả từ yến trắng.</li>
<li><strong>Yến nhà giả yến đảo tự nhiên:</strong> Do tâm lý khách hàng đôi lúc nghĩ rằng yến đảo sẽ chứa nhiều chất dinh dưỡng hơn so với yến được nuôi ngay tại nhà. Nhưng thực chất yến đảo lại có mùi tanh và khó làm sạch hơn yến nhà rất nhiều và giá trị dinh dưỡng cũng không chênh lệch nhiều.</li>
<li><strong>Yến bị tẩy trắng:</strong> Nếu bạn nghe được mùi tanh nồng nặc thì tuyệt đối nên cẩn thận khi mua. Việc tẩy trắng sẽ gây nồng nặc mùi hóa chất, và để ngụy trang họ sẽ phết lên 1 lớp lòng trắng trứng bên ngoài.</li>
<li><strong>Yến bị độn thêm:</strong> Để làm tăng trọng lượng của yến thì các nhà cung cấp còn có thể độn thêm bằng cách trộn cùng muối, đường, nấm, rau củ,...</li>
</ul>
`;

const postObj = {
  id: "phan-biet-yen-that-gia",
  type: "blog",
  title: "10 Cách Phân Biệt Yến Sào Thật - Giả Chính Xác Nhất",
  content: contentHTML,
  author: "Tám Thủy",
  date: "19 Tháng 07, 2026",
  thumbnail: "./assets/images/yen-tinh-che.webp",
  tags: [
    "Kiến Thức",
    "Cẩm Nang"
  ]
};

fs.writeFileSync(path, JSON.stringify(postObj, null, 2), 'utf8');

// Also update index.json
const indexPath = 'D:\\CODEs\\tamthuy\\yen-sao-site\\src\\data\\posts\\index.json';
let indexContent = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

indexContent.push({
  id: "phan-biet-yen-that-gia",
  title: "10 Cách Phân Biệt Yến Sào Thật - Giả Chính Xác Nhất",
  excerpt: "Hiện nay trên thị trường có rất nhiều tổ yến giả làm từ mủ trôm, agar hoặc tẩy trắng độc hại. Bỏ túi ngay 10 tuyệt chiêu nhận biết tổ yến thật...",
  thumbnail: "./assets/images/yen-tinh-che.webp",
  tags: ["Kiến Thức", "Cẩm Nang"],
  date: "19 Tháng 07, 2026",
  readTime: "7 phút đọc"
});

fs.writeFileSync(indexPath, JSON.stringify(indexContent, null, 2), 'utf8');

console.log('Created new blog post and updated index.json');
