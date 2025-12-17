var iUp = (function () {
	var time = 0,
		duration = 150,
		clean = function () {
			time = 0;
		},
		up = function (element) {
			setTimeout(function () {
				element.classList.add("up");
			}, time);
			time += duration;
		},
		down = function (element) {
			element.classList.remove("up");
		},
		toggle = function (element) {
			setTimeout(function () {
				element.classList.toggle("up");
			}, time);
			time += duration;
		};
	return {
		clean: clean,
		up: up,
		down: down,
		toggle: toggle
	};
})();


// Bing image URL pattern: validates format and prevents CSS injection
var BING_IMAGE_URL_PATTERN = /^\/th\?id=OHR\.[a-zA-Z0-9_\-]+\.jpg(&[a-zA-Z0-9=._\-]+)*$/;

function getBingImages(imgUrls) {
	/**
	 * 获取Bing壁纸
	 * 先使用 GitHub Action 每天获取 Bing 壁纸 URL 并更新 images.json 文件
	 * 然后读取 images.json 文件中的数据
	 */
	var panel = document.querySelector('#panel');
	if (!panel || !imgUrls || !Array.isArray(imgUrls) || imgUrls.length === 0) {
		return;
	}
	
	var indexName = "bing-image-index";
	var index = parseInt(sessionStorage.getItem(indexName), 10);
	var maxIndex = imgUrls.length - 1;
	

	// 如果 index 不存在或超出数组长度 → 重置为 0

	// 否则 → index++，轮播到下一张

	// 如果增加后超出数组长度 → 重置为 0

	// 效果：循环轮播图片

	if (isNaN(index) || index > maxIndex) {
		index = 0;
	} else {
		index++;
		if (index > maxIndex) {
			index = 0;
		}
	}
	

	// 确保 imgUrl：存在是字符串,符合之前定义的正则 BING_IMAGE_URL_PATTERN

	// 目的：防止恶意 CSS 注入（比如 URL 里含有特殊字符破坏样式），保证安全。
	var imgUrl = imgUrls[index];
	// Validate URL format to prevent CSS injection
	if (!imgUrl || typeof imgUrl !== 'string' || !imgUrl.match(BING_IMAGE_URL_PATTERN)) {
		return;
	}
	
	// Use backgroundImage property with proper escaping to prevent CSS injection
	var url = "https://www.cn.bing.com" + imgUrl;
	panel.style.backgroundImage = "url('" + url.replace(/['\\]/g, '\\$&') + "')";
	panel.style.backgroundPosition = "center center";
	panel.style.backgroundRepeat = "no-repeat";
	panel.style.backgroundColor = "#666";
	panel.style.backgroundSize = "cover";
	sessionStorage.setItem(indexName, index);
}


//：把一个被编码的邮箱地址解码出来，然后打开用户的默认邮箱客户端进行发邮件
function decryptEmail(encoded) {
	var address = atob(encoded);
	window.location.href = "mailto:" + address;		//打开默认邮件客户端并填写收件人
}

document.addEventListener('DOMContentLoaded', function () {
	// 获取一言数据
	fetch("https://v1.hitokoto.cn")
		.then(function(response) {
			return response.json();
		})
		.then(function(res) {
			var descElement = document.getElementById('description');
			if (descElement && res.hitokoto && res.from) {
				// Create text nodes to prevent XSS
				var textNode = document.createTextNode(res.hitokoto);
				var br = document.createElement('br');
				var fromText = document.createTextNode(' -「');
				var strong = document.createElement('strong');
				strong.textContent = res.from;
				var endText = document.createTextNode('」');
				
				descElement.innerHTML = '';
				descElement.appendChild(textNode);
				descElement.appendChild(br);
				descElement.appendChild(fromText);
				descElement.appendChild(strong);
				descElement.appendChild(endText);
			}
		})
		.catch(function(error) {
			console.error('Error fetching hitokoto:', error);
		});

	var iUpElements = document.querySelectorAll(".iUp");
	for (var i = 0; i < iUpElements.length; i++) {
		iUp.up(iUpElements[i]);
	}

	var avatarElement = document.querySelector(".js-avatar");
	if (avatarElement) {
		avatarElement.addEventListener('load', function () {
			avatarElement.classList.add("show");
		});
	}
});

var btnMobileMenu = document.querySelector('.btn-mobile-menu__icon');			//btnMobileMenu  手机端菜单按钮（通常是“☰ / 箭头”图标）
var navigationWrapper = document.querySelector('.navigation-wrapper');			//navigationWrapper 菜单容器（导航栏本体）

if (btnMobileMenu && navigationWrapper) {
	btnMobileMenu.addEventListener('click', function () {
		var isVisible = navigationWrapper.classList.contains('visible');
		
		function handleAnimationEnd() {
			navigationWrapper.classList.remove('visible', 'animated', 'bounceOutUp');
			navigationWrapper.removeEventListener('animationend', handleAnimationEnd);
		}
		
		//bounceInDown进入动画，bounceOutUp退出动画

		if (isVisible) {
			navigationWrapper.addEventListener('animationend', handleAnimationEnd);
			navigationWrapper.classList.remove('bounceInDown');
			navigationWrapper.classList.add('animated', 'bounceOutUp');
		} else {
			navigationWrapper.classList.add('visible', 'animated', 'bounceInDown');
		}
		
		btnMobileMenu.classList.toggle('icon-list');
		btnMobileMenu.classList.toggle('icon-angleup');
	});
}

function showWeChatModal() {
	const modal = document.getElementById('wechatModal');
	modal.style.display = 'flex';
	setTimeout(() => {
		modal.style.opacity = '1';
		modal.style.visibility = 'visible';
	}, 10);
}

function closeWeChatModal() {
	const modal = document.getElementById('wechatModal');
	modal.style.opacity = '0';
	modal.style.visibility = 'hidden';
	setTimeout(() => {
		modal.style.display = 'none';
	}, 300);
}
