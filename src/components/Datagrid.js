import React from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Stack,
  Table,
  
} from "react-bootstrap";
import axios from "axios";
import { useState, useEffect } from "react";
import Search from "./Search";
import EditUser from "./EditUser";
import CustomPagination from "./CustomPagination";
import { useSnackbar } from "notistack";
import Button from '@mui/material/Button';

export const Datagrid = () => {
  const [usersData, setUsersData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedUsers, setCheckedUsers] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [updateUserId, setUpdateUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const API_URL =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

  const updateUser = (userId) => {
    setUpdateUserId(userId);
    setModalShow(true);
  };

  const handleSelectAll = (event) => {
    let newList = [...selectedUsers];
    if (event.target.checked) {
      setIsAllChecked(true);
      newList = currentUsers.map((user) => user.id);
    } else {
      setIsAllChecked(false);
      newList = [];
    }
    setCheckedUsers(newList);
  };{}

  const handleDeleteSelected = () => {
    const newList = usersData.filter(
      (user) => !selectedUsers.includes(user.id)
    );
    
    const newFilteredList = filteredUsers.filter(
      (user) => !selectedUsers.includes(user.id)
    );
    
   

    setUsersData(newList);
    setFilteredUsers(newFilteredList);
    setIsAllChecked(false);
   
    if (selectedUsers.length )
    {
       enqueueSnackbar("Data deleted successfully ", { variant: "success" });
    }
    else
    {
      enqueueSnackbar("No data selected to delete ", { variant: "warning" });
      }
  };

  const handleSelect = (event) => {
    const userId = event.target.value;
    let newList = [...selectedUsers];

    if (event.target.checked) {
      newList = [...selectedUsers, userId];
    } else {
      setIsAllChecked(false);
      newList.splice(selectedUsers.indexOf(userId), 1);
    }
    setCheckedUsers(newList);
  };

  const handleDelete = (userId) => {
    const newList  = usersData.filter((user) => user.id !== userId);
    enqueueSnackbar("Data deleted successfully ", { variant: "success" });
    setUsersData(newList );
  };

  const onSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filter = () => {
    if (searchText !== "") {
      const result = usersData.filter((obj) =>
        Object.keys(obj).some((key) => obj[key].includes(searchText))
      );
      setFilteredUsers(result);
    } else {
      setFilteredUsers(usersData);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsersData(response.data);
    } catch (error) {
      console.log("Error in getting users", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filter();
  }, [usersData, searchText]);

  
  const indexOfLastUserData = currentPage * rowsPerPage;
  const indexOfFirstUserData = indexOfLastUserData - rowsPerPage;
  const currentUsers = filteredUsers.length ? filteredUsers.slice(indexOfFirstUserData, indexOfLastUserData) : usersData.slice(indexOfFirstUserData, indexOfLastUserData);
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / rowsPerPage);

  const paginate = (pageNumber) => {
   if(!isAllChecked){
  setIsAllChecked(false)


   }
    setCurrentPage(pageNumber)
  };

  return (
    <Container >
      <Row>
        <Col>
          <Search onSearch={onSearch} />
        </Col>
      </Row>
      <Row>
        <Col >
          <Table hover responsive>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={isAllChecked}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {currentUsers.map((user) => {
                  return (
                    <tr
                      key={user.id}
                    >
                      <td>
                        <Form.Check
                          type="checkbox"
                          value={user.id}
                          onChange={handleSelect}
                          checked={selectedUsers.includes(user.id)}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <Stack direction="horizontal" >
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => updateUser(user.id)}
                          >
                            <i className="bi bi-pencil-square text-primary"></i>
                          </Button>

                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            <i className="bi bi-trash text-danger"></i>
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
   {
    <Row className="pt-2 pt-md-0">
    <Col xs="12" md="4" sm="6">
    <Button variant="outlined" color="error" onClick={handleDeleteSelected}>
        Delete Selected
      </Button>
    </Col>
    <Col xs="12" md="8" sm="6">
      <CustomPagination
   
        currentPage={currentPage}
        checked={isAllChecked}
      
        paginate={paginate}
        totalPages={totalPages}
        disabled={selectedUsers.length > 0 ? false : true}
      />
    </Col>
  </Row>
   }
      {modalShow ? (
        <EditUser
          users={usersData}
          setUsers={setUsersData}
          userId={updateUserId}
          setModalShow={setModalShow}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      ) : (
        null
      )}
    </Container>
  );
};
