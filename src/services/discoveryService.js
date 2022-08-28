import axios from 'axios';

export class DiscoveryService{
    static async getProjects() {
        return axios.get('/discovery');
    }

    static getProject(uuid) {
        return axios.get('/discovery/'+uuid);
    }
}