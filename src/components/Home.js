import React, { useEffect, useState } from 'react'
import './Home.css';
import Table from './Table';
import Pagination from './Pagination';

const IsCheckEdit = (users) => {
    const IscheckedEdited = users.map((user) => {
        return { ...user, isChecked: false, isEdited: false };
    });

    return IscheckedEdited;
};

const validateInput = (userDetails) => {
    if (userDetails.name !== "" && userDetails.email !== "" && userDetails.role !== "") {
        if (userDetails.name.length < 5) {
            alert("Name must be at least 5 characters long");
        } else if (!userDetails.email.match(/.+@+.+\.[com|in|org]+$/)) {
            alert("Please enter Valid a email ex.abc@gmail.com");
        } else if (
            userDetails.role.toLowerCase() === "member" ||
            userDetails.role.toLowerCase() === "admin"
        ) {
            return true;
        } else {
            alert(`Role must be "Admin" or "Member"`);
        }
    } else {
        alert("Please fill out the input field");
    }
    return false;
};


const ITEMS_PER_PAGE = 10;
const Home = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    // let editMyData;

    useEffect(() => {
        // Fetch users from API
        fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
            .then(response => response.json())
            .then(data => {
                const userData = IsCheckEdit(data)
                setUsers(userData);
                setFilteredUsers(userData);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    //To handle seacrh data .
    const handleSearch = query => {
        const filtered = users.filter(user =>
            Object.values(user).some(value =>
                value.toString().toLowerCase().includes(query.toLowerCase())
            )
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    const handlePageChange = page => {
        setCurrentPage(page);
    };


    //To handle select single row.
    const handleRowSelect = userId => {
        if (selectedRows.includes(userId)) {
            setSelectedRows(selectedRows.filter(id => id !== userId));
        } else {
            setSelectedRows([...selectedRows, userId]);
        }
    };
    //To handle delete single data.
    const handleDelete = (userId) => {
        const remainingUser = filteredUsers.filter(user => user.id !== userId)
        setFilteredUsers(remainingUser)
    }
    //To handle the delete multiple data which is selected.
    const handleDeleteSelected = () => {
        const remainingUsers = filteredUsers.filter(user => !selectedRows.includes(user.id));
        setFilteredUsers(remainingUsers);
        setSelectedRows([]);
    };

    //It will help to select the all the data which available on current page.
    const handleSelectAll = () => {
        if (selectedRows.length === currentItems.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(currentItems.map(user => user.id));
        }
    };

   //For save the edited data.
    const handleSave = (userId, editedFields) => {
        if (validateInput(editedFields)) {
            const updatedData = users.map((user) => {
                if (user.id === userId) {
                    return { ...user, ...editedFields, isEdited: false };
                }
                return user;
            });

            const updatedFilteredData = filteredUsers.map((user) => {
                if (user.id === userId) {
                    return { ...user, ...editedFields, isEdited: false };
                }
                return user;
            });

            setCurrentPage(JSON.parse(localStorage.getItem('currentPage')));
            setUsers(updatedData);
            setFilteredUsers(updatedFilteredData);
            localStorage.setItem('users', JSON.stringify(updatedData));
            alert("User's information saved successfully.");
        }
    };


   //To handle the cancel during edit data.
    const handleCancel = (userId) => {
        const nothignToEdit = users.map((user) => {
            if (user.id === userId) {
                return { ...user, isEdited: false }
            }
            return user;
        })
        setUsers(nothignToEdit);
    }

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    console.log(indexOfLastItem)
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    console.log(indexOfFirstItem)
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    console.log(currentItems);

    return (
        <div className="admin-ui">
            <h1>Admin Interface</h1>
            <input
                type="text"
                placeholder="Search by name, email or role"
                onChange={e => handleSearch(e.target.value)}
            />

            <Table
                users={currentItems}
                selectedRows={selectedRows}
                onSelect={handleRowSelect}
                onSelectAll={handleSelectAll}
                onDelete={handleDelete}
                onSave={handleSave}
                onCancel={handleCancel}
            />

            <Pagination
                totalItems={filteredUsers.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
            <button className='delete-select' onClick={handleDeleteSelected} disabled={selectedRows.length === 0}>Delete Selected</button>
        </div>
    );
}
export default Home;