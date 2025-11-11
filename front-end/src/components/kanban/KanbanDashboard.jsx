import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react';
import apiClient from '../../services/apiClient';
import ProfileDropdown from '../auth/ProfileDropdown';

const KanbanDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState({});
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedListForTask, setSelectedListForTask] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newListName, setNewListName] = useState('');
  const [newTaskData, setNewTaskData] = useState({ title: '', due_date: '' });

  // Fetch all projects
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch lists when a project is selected
  useEffect(() => {
    if (selectedProject) {
      fetchLists(selectedProject.id);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const data = await apiClient.get('/projects');
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchLists = async (projectId) => {
    setLoading(true);
    try {
      const data = await apiClient.get(`/projects/${projectId}/lists`);
      setLists(data);
      
      // Fetch tasks for each list
      const tasksData = {};
      for (const list of data) {
        const listTasks = await apiClient.get(`/projects/${projectId}/lists/${list.id}/tasks`);
        tasksData[list.id] = listTasks;
      }
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    
    try {
      await apiClient.post('/projects', { name: newProjectName });
      setNewProjectName('');
      setShowNewProjectModal(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const createList = async () => {
    if (!newListName.trim() || !selectedProject) return;
    
    try {
      await apiClient.post(`/projects/${selectedProject.id}/lists`, { name: newListName });
      setNewListName('');
      setShowNewListModal(false);
      fetchLists(selectedProject.id);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const createTask = async () => {
    if (!newTaskData.title.trim() || !selectedListForTask || !selectedProject) return;
    
    try {
      await apiClient.post(
        `/projects/${selectedProject.id}/lists/${selectedListForTask}/tasks`,
        newTaskData
      );
      setNewTaskData({ title: '', due_date: '' });
      setShowNewTaskModal(false);
      setSelectedListForTask(null);
      fetchLists(selectedProject.id);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const deleteTask = async (listId, taskId) => {
    if (!selectedProject) return;
    
    try {
      await apiClient.delete(
        `/projects/${selectedProject.id}/lists/${listId}/tasks/${taskId}`
      );
      fetchLists(selectedProject.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="flex h-screen bg-purple-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Todo App</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer group"
              >
                <div className={`rotate-icon ${isProjectsOpen ? 'open' : ''}`}>
                  <ChevronRight size={16} />
                </div>
                <span className="transition-colors duration-200">Projects</span>
              </button>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="p-1 hover:bg-gray-100 rounded cursor-pointer transition-colors duration-200"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
            
            <div className={`projects-content ${isProjectsOpen ? 'open' : ''}`}>
              <div className="ml-4 space-y-1">
                {projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`w-full text-left px-3 py-2 rounded text-sm cursor-pointer ${
                      selectedProject?.id === project.id
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-800">
            {selectedProject?.name || 'Select a project'}
          </h1>
          
          {/* Profile Dropdown */}
          <ProfileDropdown />
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <div className="p-6 flex gap-4 min-h-min">
              {lists.map(list => (
                <div key={list.id} className="flex-shrink-0 w-80">
                  <div className="bg-gray-100 rounded-lg p-4 h-full flex flex-col">
                    <h3 className="font-semibold text-gray-800 mb-4">{list.name}</h3>
                    
                    <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                      {tasks[list.id]?.map(task => (
                        <div
                          key={task.id}
                          className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-gray-800">{task.title}</h4>
                            <button
                              onClick={() => deleteTask(list.id, task.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          {task.due_date && (
                            <p className="text-xs text-gray-500">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedListForTask(list.id);
                        setShowNewTaskModal(true);
                      }}
                      className="w-full py-2 text-sm text-gray-700 hover:bg-gray-200 font-semibold rounded flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus size={16} />
                      Add a card
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="flex-shrink-0 w-80">
                <button
                  onClick={() => setShowNewListModal(true)}
                  className="w-full bg-white text-gray-700 hover:bg-gray-200 rounded-lg p-2 font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={20} />
                  Add another list
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 w-96 animate-slideUp">
            <h3 className="text-lg font-bold mb-4">Create New Project</h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
              onKeyPress={(e) => e.key === 'Enter' && createProject()}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowNewProjectModal(false);
                  setNewProjectName('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New List Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 w-96 animate-slideUp">
            <h3 className="text-lg font-bold mb-4">Create New List</h3>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
              onKeyPress={(e) => e.key === 'Enter' && createList()}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowNewListModal(false);
                  setNewListName('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={createList}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 w-96 animate-slideUp">
            <h3 className="text-lg font-bold mb-4">Create New Card</h3>
            <input
              type="text"
              value={newTaskData.title}
              onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
              placeholder="Card title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <input
              type="date"
              value={newTaskData.due_date}
              onChange={(e) => setNewTaskData({ ...newTaskData, due_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowNewTaskModal(false);
                  setNewTaskData({ title: '', due_date: '' });
                  setSelectedListForTask(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={createTask}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanDashboard;