import axios from 'axios';

export class ProjectsService{
    static async getProjects() {
        return axios.get('/projects');
    }

    static getProject(uuid) {
        return axios.get('/projects/'+uuid);
    }

    static getProjectModels(uuid) {
        return axios.get('/projects/'+uuid+'/models');
    }

    static save(project) {
        return axios.post('/projects', project);
    }
}