import React, { useState } from 'react';
import './Table.css';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

const UserTable = ({ users, selectedRows, onSelect, onSelectAll, onDelete, onSave, onCancel }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedFields, setEditedFields] = useState({});

  const handleEdit = (userId) => {
    setEditingId(userId);
    // Store the current user's fields for editing
    setEditedFields({ ...users.find(user => user.id === userId) });
  };

  const handleInputChange = (event, field) => {
    const { value } = event.target;
    setEditedFields(prevFields => ({ ...prevFields, [field]: value }));
  };

  const handleSave = (userId) => {
    onSave(userId, editedFields);
    setEditingId(null);
    setEditedFields({});
  };

  const handleCancel = () => {
    onCancel();
    setEditingId(null);
    setEditedFields({});
  };

  const handleDelete = (userId) => {
    onDelete(userId);
  };

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th className="select-all-column">
            <input
              className="check-box"
              type="checkbox"
              checked={selectedRows.length === users.length}
              onChange={onSelectAll}
            />
          </th>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className={selectedRows.includes(user.id) ? 'selected-row' : ''}>
            <td><input className="check-box" type="checkbox" checked={selectedRows.includes(user.id)} onChange={() => onSelect(user.id)}/></td>
            <td>{user.id}</td>
            <td>
              {editingId === user.id ? (
                <input
                  type="text"
                  value={editedFields.name || ''}
                  onChange={(event) => handleInputChange(event, 'name')}
                />
              ) : (
                user.name
              )}
            </td>
            <td>
              {editingId === user.id ? (
                <input
                  type="text"
                  value={editedFields.email || ''}
                  onChange={(event) => handleInputChange(event, 'email')}
                />
              ) : (
                user.email
              )}
            </td>
            <td>
              {editingId === user.id ? (
                <input
                  type="text"
                  value={editedFields.role || ''}
                  onChange={(event) => handleInputChange(event, 'role')}
                />
              ) : (
                user.role
              )}
            </td>
            <td>
              {editingId === user.id ? (
                <>
                  <button className='save-data' onClick={() => handleSave(user.id)}>Save</button>
                  <button className='cancel-data' onClick={() => handleCancel()}>Cancel</button>
                </>
              ) : (
                <>
                  <FaEdit className='edit-data' onClick={() => handleEdit(user.id)}/>
                  <MdDelete className='delete-data' onClick={() => handleDelete(user.id)} />
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
