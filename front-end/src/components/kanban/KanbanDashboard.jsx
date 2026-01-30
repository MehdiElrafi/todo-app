import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Plus, X, Tag, MoreVertical } from 'lucide-react';
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
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedListForTask, setSelectedListForTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newListName, setNewListName] = useState('');
  const [newTaskData, setNewTaskData] = useState({ title: '', due_date: '' });
  const [projectLabels, setProjectLabels] = useState([]);
  const [showLabelPopover, setShowLabelPopover] = useState(false);
  const labelPopoverRef = useRef(null);
  const [openProjectMenu, setOpenProjectMenu] = useState(null);

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

  // Close label popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (labelPopoverRef.current && !labelPopoverRef.current.contains(event.target)) {
        setShowLabelPopover(false);
      }
    };

    if (showLabelPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLabelPopover]);

  // Close project menu when clicking outside
  useEffect(() => {
    if (!openProjectMenu) return;

    const handleClickOutside = (event) => {
      // If click is outside the project menu area, close it
      if (!event.target.closest('[role="button"], [data-project-menu-button], div[data-project-menu-content]')) {
        setOpenProjectMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openProjectMenu]);

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

  const deleteProject = async (projectId) => {
    // Optimistically remove the project from UI
    setProjects(prev => prev.filter(p => p.id !== projectId));
    
    // If the deleted project was selected, select the first remaining project
    if (selectedProject?.id === projectId) {
      const remaining = projects.filter(p => p.id !== projectId);
      setSelectedProject(remaining.length > 0 ? remaining[0] : null);
    }

    try {
      await apiClient.delete(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error deleting project:', error);
      // On error, refetch projects to restore state
      try {
        await fetchProjects();
      } catch (err) {
        console.error('Error refetching projects after failed delete:', err);
      }
    }
  };

  const showTask = async (listId, taskId) => {
    if (!selectedProject) return;
    try {
      const data = await apiClient.get(
        `/projects/${selectedProject.id}/lists/${listId}/tasks/${taskId}`
      );
      // Ensure list_id is set for later use
      data.list_id = listId;
      setSelectedTask(data);
      setShowTaskModal(true);
    } catch (error) {
      console.error('Error fetching task:', error);
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

    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      id: tempId,
      title: newTaskData.title,
      due_date: newTaskData.due_date || null
    };

    // Optimistically add task to UI
    setTasks(prev => ({
      ...prev,
      [selectedListForTask]: [...(prev[selectedListForTask] || []), optimisticTask]
    }));

    // Close modal immediately for smooth UX
    setNewTaskData({ title: '', due_date: '' });
    setShowNewTaskModal(false);
    setSelectedListForTask(null);

    try {
      const created = await apiClient.post(
        `/projects/${selectedProject.id}/lists/${selectedListForTask}/tasks`,
        optimisticTask
      );

      // Replace optimistic task with server-provided task (match by tempId)
      const createdTask = created && created.id ? created : created;
      setTasks(prev => ({
        ...prev,
        [selectedListForTask]: (prev[selectedListForTask] || []).map(t =>
          t.id === tempId ? createdTask : t
        )
      }));
    } catch (error) {
      console.error('Error creating task:', error);
      // Remove optimistic task and refetch the affected list tasks to restore state
      setTasks(prev => ({
        ...prev,
        [selectedListForTask]: (prev[selectedListForTask] || []).filter(t => t.id !== tempId)
      }));
      try {
        const listTasks = await apiClient.get(
          `/projects/${selectedProject.id}/lists/${selectedListForTask}/tasks`
        );
        setTasks(prev => ({ ...prev, [selectedListForTask]: listTasks }));
      } catch (err) {
        console.error('Error refetching tasks after failed create:', err);
      }
    }
  };

  const deleteTask = async (listId, taskId) => {
    if (!selectedProject) return;

    // Optimistically remove the task from UI
    setTasks(prev => ({
      ...prev,
      [listId]: (prev[listId] || []).filter(t => t.id !== taskId)
    }));

    try {
      await apiClient.delete(
        `/projects/${selectedProject.id}/lists/${listId}/tasks/${taskId}`
      );
    } catch (error) {
      console.error('Error deleting task:', error);
      // On error, refetch tasks for the affected list to restore state
      try {
        const listTasks = await apiClient.get(
          `/projects/${selectedProject.id}/lists/${listId}/tasks`
        );
        setTasks(prev => ({ ...prev, [listId]: listTasks }));
      } catch (err) {
        console.error('Error refetching tasks after failed delete:', err);
      }
    }
  };

  const deleteList = async (listId) => {
    if (!selectedProject) return;

    setLists(prev => prev.filter(l => l.id !== listId));
    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[listId];
      return newTasks;
    });

    try {
      await apiClient.delete(
        `/projects/${selectedProject.id}/lists/${listId}`
      );
    } catch (error) {
      console.error('Error deleting list:', error);
      try {
        await fetchLists(selectedProject.id);
      } catch (err) {
        console.error('Error refetching lists after failed delete:', err);
      }
    }
  };

  const fetchProjectLabels = async () => {
    if (!selectedProject) return;
    try {
      const labels = await apiClient.get(`/projects/${selectedProject.id}/labels`);
      setProjectLabels(labels);
    } catch (error) {
      console.error('Error fetching project labels:', error);
    }
  };

  const handleSetLabel = async (labelId) => {
    if (!selectedTask || !selectedProject) return;
    try {
      const updatedTask = await apiClient.patch(
        `/projects/${selectedProject.id}/lists/${selectedTask.list_id}/tasks/${selectedTask.id}`,
        { label_id: labelId }
      );
      setSelectedTask(updatedTask);
      setShowLabelPopover(false);
    } catch (error) {
      console.error('Error updating task label:', error);
    }
  };

  const handleRemoveLabel = async () => {
    if (!selectedTask || !selectedProject) return;

    try {
      const updatedTask = await apiClient.patch(
        `/projects/${selectedProject.id}/lists/${selectedTask.list_id}/tasks/${selectedTask.id}`,
        { label_id: null }
      );
      setSelectedTask(updatedTask);
      setShowLabelPopover(false);
    } catch (error) {
      console.error('Error removing task label:', error);
    }
  };

  return (
    <div className="flex h-screen bg-purple-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Todo App</h1>
        </div>
        
        <div className="flex-1 p-4">
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
            
            {isProjectsOpen && (
              <div className="ml-4 space-y-1 relative z-40">
                {projects.map(project => (
                  <div key={project.id} className="flex items-center group">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className={`flex-1 text-left px-3 py-2 rounded text-sm cursor-pointer ${
                        selectedProject?.id === project.id
                          ? 'bg-purple-100 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {project.name}
                    </button>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenProjectMenu(openProjectMenu === project.id ? null : project.id);
                        }}
                        className="p-1 rounded cursor-pointer transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        title="Project actions"
                      >
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                      {openProjectMenu === project.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Are you sure you want to delete this project?')) {
                                deleteProject(project.id);
                                setOpenProjectMenu(null);
                              }
                            }}
                            className="w-full flex items-center justify-between gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <X size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-800">{list.name}</h3>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this list?')) {
                            deleteList(list.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-600 cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                      {tasks[list.id]?.map(task => (
                        <div
                          key={task.id}
                          className="bg-white rounded-lg p-3 cursor-pointer border border-transparent hover:border-purple-700"
                          onClick={() => showTask(list.id, task.id)}
                        >
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <div className="flex flex-col gap-y-2 flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 break-words w-full">{task.title}</h4>
                              {/* Selected Label Display */}
                              {task.label && (
                                <div className="mb-3 flex items-center gap-2">
                                  <div
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium"
                                    style={{ backgroundColor: task.label.color || '#999999' }}
                                  >
                                    <span>{task.label.name}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this task?')) {
                                  deleteTask(list.id, task.id);
                                }
                              }}
                              className="text-gray-400 hover:text-red-600 cursor-pointer"
                            >
                              <X size={16} />
                            </button>
                          </div>
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
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
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
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={createList}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
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
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={createTask}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Task Details Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 w-96 animate-slideUp">
            <div className="flex justify-between items-start gap-2">
              <div className="flex flex-col gap-y-2 flex-1 min-w-0">
                <h3 className="text-lg font-bold break-words w-full">{selectedTask.title}</h3>
                {/* Selected Label Display */}
                {selectedTask.label && (
                  <div className="mb-3 flex items-center gap-2">
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium"
                      style={{ backgroundColor: selectedTask.label.color || '#999999' }}
                    >
                      <span>{selectedTask.label.name}</span>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setSelectedTask(null);
                }}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Set Label Button */}
            <div className="mb-4 relative" ref={labelPopoverRef}>
              <button
                onClick={() => {
                  setShowLabelPopover(!showLabelPopover);
                  if (!showLabelPopover) {
                    fetchProjectLabels();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Tag size={16} />
                Set Label
              </button>

              {/* Label Popover */}
              {showLabelPopover && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 max-h-60 overflow-y-auto">
                  {projectLabels.length > 0 ? (
                    <>
                      <div className="space-y-2 mb-2">
                        {projectLabels.map(label => (
                          <button
                            key={label.id}
                            onClick={() => handleSetLabel(label.id)}
                            className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer text-left transition-colors"
                          >
                            <div
                              className="w-4 h-4 rounded flex-shrink-0"
                              style={{ backgroundColor: label.color || '#999999' }}
                            ></div>
                            <span className="text-sm text-gray-700">{label.name}</span>
                          </button>
                        ))}
                      </div>
                      {selectedTask.label && (
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <button
                            onClick={handleRemoveLabel}
                            className="w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                          >
                            Remove Label
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 p-2">No labels available</p>
                  )}
                </div>
              )}
            </div>

            {selectedTask.due_date ? (
              <p className="text-sm text-gray-600">Due: {new Date(selectedTask.due_date).toLocaleDateString()}</p>
            ) : (
              <p className="text-sm text-gray-500">No due date</p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setSelectedTask(null);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanDashboard;