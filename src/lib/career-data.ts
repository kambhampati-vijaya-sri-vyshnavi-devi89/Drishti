
export type Skill = {
    id: string;
    name: string;
};

export type CareerPath = {
    id: string;
    name: string;
    description: string;
    skills: Skill[];
};

export const SKILLS_LIST: Skill[] = [
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'react', name: 'React' },
    { id: 'nodejs', name: 'Node.js' },
    { id: 'sql', name: 'SQL' },
    { id: 'nosql', name: 'NoSQL' },
    { id: 'cloud', name: 'Cloud (AWS/GCP/Azure)' },
    { id: 'docker', name: 'Docker' },
    { id: 'kubernetes', name: 'Kubernetes' },
    { id: 'ml', name: 'Machine Learning' },
    { id: 'data-analysis', name: 'Data Analysis' },
    { id: 'statistics', name: 'Statistics' },
    { id: 'figma', name: 'Figma' },
    { id: 'sketch', name: 'Sketch' },
    { id: 'user-research', name: 'User Research' },
    { id: 'prototyping', name: 'Prototyping' },
    { id: 'product-strategy', name: 'Product Strategy' },
    { id: 'agile', name: 'Agile Methodologies' },
    { id: 'market-research', name: 'Market Research' },
    { id: 'communication', name: 'Communication' },
    { id: 'teamwork', name: 'Teamwork' },
    { id: 'problem-solving', name: 'Problem Solving' },
];

export const CAREER_PATHS: CareerPath[] = [
    {
        id: 'software-engineer',
        name: 'Software Engineer',
        description: 'Build and maintain web and mobile applications using various programming languages and frameworks.',
        skills: [
            { id: 'javascript', name: 'JavaScript' },
            { id: 'react', name: 'React' },
            { id: 'nodejs', name: 'Node.js' },
            { id: 'sql', name: 'SQL' },
            { id: 'cloud', name: 'Cloud (AWS/GCP/Azure)' },
            { id: 'docker', name: 'Docker' },
            { id: 'problem-solving', name: 'Problem Solving' },
            { id: 'teamwork', name: 'Teamwork' },
        ],
    },
    {
        id: 'data-scientist',
        name: 'Data Scientist',
        description: 'Analyze complex data sets to extract insights and build predictive models using statistical methods and machine learning.',
        skills: [
            { id: 'python', name: 'Python' },
            { id: 'sql', name: 'SQL' },
            { id: 'ml', name: 'Machine Learning' },
            { id: 'data-analysis', name: 'Data Analysis' },
            { id: 'statistics', name: 'Statistics' },
            { id: 'communication', name: 'Communication' },
            { id: 'problem-solving', name: 'Problem Solving' },
        ],
    },
    {
        id: 'ux-designer',
        name: 'UX Designer',
        description: 'Design intuitive and user-friendly digital products through research, wireframing, and prototyping.',
        skills: [
            { id: 'figma', name: 'Figma' },
            { id: 'sketch', name: 'Sketch' },
            { id: 'user-research', name: 'User Research' },
            { id: 'prototyping', name: 'Prototyping' },
            { id: 'communication', name: 'Communication' },
            { id: 'problem-solving', name: 'Problem Solving' },
        ],
    },
    {
        id: 'product-manager',
        name: 'Product Manager',
        description: 'Define product vision, strategy, and roadmap, and lead cross-functional teams to deliver valuable products.',
        skills: [
            { id: 'product-strategy', name: 'Product Strategy' },
            { id: 'agile', name: 'Agile Methodologies' },
            { id: 'market-research', name: 'Market Research' },
            { id: 'communication', name: 'Communication' },
            { id: 'teamwork', name: 'Teamwork' },
            { id: 'data-analysis', name: 'Data Analysis' },
        ],
    },
    {
        id: 'devops-engineer',
        name: 'DevOps Engineer',
        description: 'Automate and streamline the software development lifecycle, from code to deployment and maintenance.',
        skills: [
            { id: 'cloud', name: 'Cloud (AWS/GCP/Azure)' },
            { id: 'docker', name: 'Docker' },
            { id: 'kubernetes', name: 'Kubernetes' },
            { id: 'nodejs', name: 'Node.js' },
            { id: 'python', name: 'Python' },
            { id: 'problem-solving', name: 'Problem Solving' },
        ],
    }
];
