// API Configuration
const API_BASE = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentAdmin = null;

// Axios configuration
axios.defaults.baseURL = API_BASE;
if (authToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
}

// Utility functions
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function showLoading(element) {
    element.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
}

// Authentication functions
async function login(email, password) {
    try {
        const response = await axios.post('/auth/login', { email, password });
        const { token, data } = response.data;
        
        authToken = token;
        localStorage.setItem('authToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        currentAdmin = data;
        showDashboard();
        loadDashboardData();
        
        showAlert('Login successful!');
    } catch (error) {
        showAlert(error.response?.data?.error || 'Login failed', 'error');
    }
}

function logout() {
    authToken = null;
    currentAdmin = null;
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    showLoginScreen();
}

function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('adminName').textContent = currentAdmin?.name || 'Admin';
}

// Tab management
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'border-indigo-500', 'text-indigo-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    
    // Show selected tab content
    document.getElementById(tabName + 'Tab').classList.remove('hidden');
    
    // Add active class to selected tab button
    event.target.classList.add('active', 'border-indigo-500', 'text-indigo-600');
    event.target.classList.remove('border-transparent', 'text-gray-500');
    
    // Load data for specific tabs
    switch(tabName) {
        case 'overview':
            loadDashboardData();
            break;
        case 'hero':
            loadHeroData();
            break;
        case 'about':
            loadAboutData();
            break;
        case 'projects':
            loadProjectsData();
            break;
        case 'contact':
            loadContactData();
            break;
        case 'messages':
            loadMessagesData();
            break;
    }
}

// Dashboard data loading
async function loadDashboardData() {
    try {
        const response = await axios.get('/admin/dashboard');
        const { data } = response.data;
        
        document.getElementById('totalMessages').textContent = data.contactStats.total;
        document.getElementById('totalProjects').textContent = data.portfolio.projectsCount;
        document.getElementById('totalSkills').textContent = data.portfolio.skillsCount;
        document.getElementById('recentActivity').textContent = data.recentActivity;
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

// Hero section management
async function loadHeroData() {
    try {
        const response = await axios.get('/portfolio');
        const { data } = response.data;
        
        document.getElementById('heroTitle').value = data.hero?.title || '';
        document.getElementById('heroSubtitle').value = data.hero?.subtitle || '';
        document.getElementById('heroDescription').value = data.hero?.description || '';
        document.getElementById('heroGithub').value = data.hero?.socialLinks?.github || '';
        document.getElementById('heroLinkedin').value = data.hero?.socialLinks?.linkedin || '';
        document.getElementById('heroEmail').value = data.hero?.socialLinks?.email || '';
    } catch (error) {
        console.error('Failed to load hero data:', error);
    }
}

async function saveHeroData(formData) {
    try {
        const heroData = {
            hero: {
                title: formData.get('title'),
                subtitle: formData.get('subtitle'),
                description: formData.get('description'),
                socialLinks: {
                    github: formData.get('github'),
                    linkedin: formData.get('linkedin'),
                    email: formData.get('email')
                }
            }
        };
        
        await axios.put('/portfolio/hero', heroData.hero);
        showAlert('Hero section updated successfully!');
    } catch (error) {
        showAlert(error.response?.data?.error || 'Failed to update hero section', 'error');
    }
}

// About section management
async function loadAboutData() {
    try {
        const response = await axios.get('/portfolio');
        const { data } = response.data;
        
        document.getElementById('aboutTitle').value = data.about?.title || '';
        document.getElementById('aboutSubtitle').value = data.about?.subtitle || '';
        document.getElementById('aboutDescription').value = data.about?.description || '';
        document.getElementById('aboutImage').value = data.about?.profileImage || '';
    } catch (error) {
        console.error('Failed to load about data:', error);
    }
}

async function saveAboutData(formData) {
    try {
        const aboutData = {
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            description: formData.get('description'),
            profileImage: formData.get('profileImage')
        };
        
        await axios.put('/portfolio/about', aboutData);
        showAlert('About section updated successfully!');
    } catch (error) {
        showAlert(error.response?.data?.error || 'Failed to update about section', 'error');
    }
}

// Projects management
async function loadProjectsData() {
    try {
        const response = await axios.get('/portfolio');
        const { data } = response.data;
        const projects = data.projects?.items || [];
        
        const projectsList = document.getElementById('projectsList');
        projectsList.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsList.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Failed to load projects data:', error);
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'bg-gray-50 rounded-lg p-4 border';
    card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <h4 class="text-lg font-medium text-gray-900">${project.title}</h4>
            <div class="flex space-x-2">
                <button onclick="editProject('${project._id}')" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteProject('${project._id}')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <p class="text-gray-600 text-sm mb-2">${project.description}</p>
        <div class="flex flex-wrap gap-1 mb-2">
            ${project.technologies.map(tech => 
                `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${tech}</span>`
            ).join('')}
        </div>
        <div class="text-xs text-gray-500">
            <div>Live: ${project.liveUrl || 'N/A'}</div>
            <div>Frontend: ${project.frontendUrl || 'N/A'}</div>
            <div>Backend: ${project.backendUrl || 'N/A'}</div>
            <div>Mobile: ${project.mobileUrl || 'N/A'}</div>
        </div>
    `;
    return card;
}

function addProject() {
    const projectData = {
        title: prompt('Project title:'),
        description: prompt('Project description:'),
        technologies: prompt('Technologies (comma-separated):').split(',').map(t => t.trim()),
        liveUrl: prompt('Live URL:'),
        frontendUrl: prompt('Frontend URL:'),
        backendUrl: prompt('Backend URL:'),
        mobileUrl: prompt('Mobile URL:'),
        image: prompt('Image URL:')
    };
    
    if (projectData.title && projectData.description) {
        saveProject(projectData);
    }
}

async function saveProject(projectData) {
    try {
        await axios.post('/portfolio/projects', projectData);
        showAlert('Project added successfully!');
        loadProjectsData();
    } catch (error) {
        showAlert(error.response?.data?.error || 'Failed to add project', 'error');
    }
}

async function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            await axios.delete(`/portfolio/projects/${projectId}`);
            showAlert('Project deleted successfully!');
            loadProjectsData();
        } catch (error) {
            showAlert(error.response?.data?.error || 'Failed to delete project', 'error');
        }
    }
}

// Contact section management
async function loadContactData() {
    try {
        const response = await axios.get('/portfolio');
        const { data } = response.data;
        
        document.getElementById('contactTitle').value = data.contact?.title || '';
        document.getElementById('contactSubtitle').value = data.contact?.subtitle || '';
        document.getElementById('contactDescription').value = data.contact?.description || '';
    } catch (error) {
        console.error('Failed to load contact data:', error);
    }
}

async function saveContactData(formData) {
    try {
        const contactData = {
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            description: formData.get('description')
        };
        
        await axios.put('/portfolio/contact', contactData);
        showAlert('Contact section updated successfully!');
    } catch (error) {
        showAlert(error.response?.data?.error || 'Failed to update contact section', 'error');
    }
}

// Messages management
async function loadMessagesData() {
    try {
        const response = await axios.get('/contact');
        const { data } = response.data;
        
        const messagesList = document.getElementById('messagesList');
        messagesList.innerHTML = '';
        
        data.forEach(message => {
            const messageCard = createMessageCard(message);
            messagesList.appendChild(messageCard);
        });
    } catch (error) {
        console.error('Failed to load messages data:', error);
    }
}

function createMessageCard(message) {
    const card = document.createElement('div');
    card.className = `bg-gray-50 rounded-lg p-4 border-l-4 ${
        message.status === 'unread' ? 'border-blue-500' : 
        message.status === 'read' ? 'border-yellow-500' : 'border-green-500'
    }`;
    card.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <div>
                <h4 class="font-medium text-gray-900">${message.name}</h4>
                <p class="text-sm text-gray-600">${message.email}</p>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-xs px-2 py-1 rounded ${
                    message.status === 'unread' ? 'bg-blue-100 text-blue-800' :
                    message.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }">${message.status}</span>
                <button onclick="deleteMessage('${message._id}')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <p class="text-gray-700 text-sm mb-2">${message.message}</p>
        <div class="text-xs text-gray-500">
            ${new Date(message.createdAt).toLocaleString()}
        </div>
    `;
    return card;
}

async function deleteMessage(messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
        try {
            await axios.delete(`/contact/${messageId}`);
            showAlert('Message deleted successfully!');
            loadMessagesData();
        } catch (error) {
            showAlert(error.response?.data?.error || 'Failed to delete message', 'error');
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (authToken) {
        showDashboard();
        loadDashboardData();
    }
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
    
    // Hero form
    document.getElementById('heroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        saveHeroData(formData);
    });
    
    // About form
    document.getElementById('aboutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        saveAboutData(formData);
    });
    
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        saveContactData(formData);
    });
});

// Global functions for HTML onclick handlers
window.logout = logout;
window.showTab = showTab;
window.addProject = addProject;
window.deleteProject = deleteProject;
window.deleteMessage = deleteMessage; 