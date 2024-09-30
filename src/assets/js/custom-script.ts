// Create floating elements
export function createFloatingElements(): void {
    const numElements = 20;
    const container = document.body;

    for (let i = 0; i < numElements; i++) {
        const element = document.createElement('div');
        element.classList.add('floating-element');

        const size = Math.random() * 50 + 10;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;

        element.style.left = `${Math.random() * 100}vw`;
        element.style.top = `${Math.random() * 100}vh`;

        element.style.animationDuration = `${Math.random() * 10 + 5}s`;
        element.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(element);
    }
}

// Handle login form submission
export function setupLoginFormListener(): void {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e: Event) {
            e.preventDefault();
            const usernameElement = document.getElementById('username') as HTMLInputElement;
            const passwordElement = document.getElementById('password') as HTMLInputElement;
            const username = usernameElement.value;
            const password = passwordElement.value;
            console.log('Login attempt:', { username, password });
            // You can add your login logic here
        });
    } else {
        console.error('Login form not found');
    }
}
