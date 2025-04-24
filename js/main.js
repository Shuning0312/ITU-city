// 主要JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 联系表单提交处理
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // 在实际应用中，这里会发送数据到服务器
            // 这里仅做演示，显示提交成功消息
            alert(`感谢您的留言，${name}！我们会尽快回复您。`);
            
            // 重置表单
            contactForm.reset();
        });
    }

    // 添加元素出现动画
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const checkIfInView = () => {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animateElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            // 检查元素是否在视口中
            if (
                (elementBottomPosition >= windowTopPosition) &&
                (elementTopPosition <= windowBottomPosition)
            ) {
                element.classList.add('animated');
            }
        });
    };
    
    // 初始检查
    checkIfInView();
    
    // 滚动时检查
    window.addEventListener('scroll', checkIfInView);
});

// 数字孪生可视化模拟（仅用于演示）
function initDigitalTwin() {
    const container = document.getElementById('digitalTwinVisualization');
    if (!container) return;
    
    // 这里将来会使用Three.js或D3.js实现真实的可视化
    // 目前仅添加占位内容
    container.innerHTML = '<div class="p-5 text-center"><h4>数字孪生可视化加载中...</h4><div class="spinner-border text-primary mt-3" role="status"><span class="visually-hidden">Loading...</span></div></div>';
}

// 区块链数据流程模拟（仅用于演示）
function initBlockchainFlow() {
    const container = document.getElementById('blockchainFlow');
    if (!container) return;
    
    // 这里将来会使用D3.js实现真实的流程图
    // 目前仅添加占位内容
    container.innerHTML = '<div class="p-5 text-center"><h4>区块链数据流程图加载中...</h4><div class="spinner-border text-primary mt-3" role="status"><span class="visually-hidden">Loading...</span></div></div>';
}

// 水质监测仪表盘模拟（仅用于演示）
function initWaterQualityDashboard() {
    const container = document.getElementById('waterQualityDashboard');
    if (!container) return;
    
    // 这里将来会使用Chart.js实现真实的仪表盘
    // 目前仅添加占位内容
    container.innerHTML = '<div class="p-5 text-center"><h4>水质监测仪表盘加载中...</h4><div class="spinner-border text-primary mt-3" role="status"><span class="visually-hidden">Loading...</span></div></div>';
}

// 初始化所有交互元素
function initInteractiveElements() {
    initDigitalTwin();
    initBlockchainFlow();
    initWaterQualityDashboard();
}

// 页面加载完成后初始化交互元素
window.addEventListener('load', initInteractiveElements);
