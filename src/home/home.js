import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

import { ReactComponent as Add } from "../img/add.svg";

function Home() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState(true);
  const [data, setData] = useState([]);
  const [display, setDisplay] = useState(false);
  const [editname, setEditname] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editId, setEditId] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [edit, setEdit] = useState(false);
  const [deleted, setDeleted] = useState(false)
  const submit = (e) => {
    e.preventDefault();
    if (edit === true) {
      var axios = require("axios");
      var dataa = JSON.stringify({
        name: editname,
        title: editTitle,
        desc: editDesc,
        status: editStatus,
      });
      var configs = {
        method: "patch",
        url: `https://todo-n-1999.herokuapp.com/aliens/${editId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: dataa,
      };

      axios(configs)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          // const res = response.data
          setDisplay(!display);
          setEdit(false)
          getTodo();
          document.querySelector('body').classList.remove('modal-open');
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      var axios = require("axios");
      var data = JSON.stringify({
        name: name,
        title: title,
        desc: desc,
        status: status,
      });

      var config = {
        method: "post",
        url: `https://todo-n-1999.herokuapp.com/aliens`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          const res = response.data;
          if (res?.success === true) {
            setDisplay(!display);
            setEdit(false)
            getTodo();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleDel = (id) => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: `https://todo-n-1999.herokuapp.com/aliens/delete/${id}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        getTodo();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getTodo = () => {
    var axios = require("axios");
    var config = {
      method: "get",
      url: `https://todo-n-1999.herokuapp.com/aliens`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    getTodo();
  }, []);

  return (
    <div className="home__wrap">
      <div className="container">
        <div className="">
          <div className="flex items-center justify-content-end gap-40">
            <button
              class="button__add btn btn-primary"
              onClick={() => {
                setDisplay(true);
              }}
            >
              + Add a task
            </button>
          </div>
        </div>
        <div className="table__todo">
          {data?.length === 0 ? 
          <div className="bg-light flex justify-content-center align-items-center" style={{height: "50vh"}}>
            <h2 className="text-center">No tasks found</h2>
            </div>
            :
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            
            <tbody>
              {
              data.length &&
                data &&
                data?.map((ele, i) => (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{ele?.title}</td>
                    <td>{ele?.name}</td>
                    <td>{ele?.desc}</td>
                    <td>{ele && ele?.status === true ? "Done" : "To do"}</td>
                    <td>
                      <button
                        className="icons__btn"
                        onClick={() => {
                          setDisplay(true);
                          setEditname(ele?.name);
                          setEditDesc(ele?.desc);
                          setEditTitle(ele?.title);
                          setEditStatus(ele?.status);
                          setEditId(ele?._id);
                          setEdit(true);
                        }}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                      className="icons__btn"
                        onClick={() => {
                          handleDel(ele?._id);
                        }}
                      >
                        {" "}
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>

          </table>
}
        </div>
      </div>


      {display ? (
        <div
          class="modal fade"
          style={{ opacity: 1 }}
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div className="mt-5 ">
                <h3
                  class="modal-title text-center"
                  id="exampleModalLongTitle text-center"
                >
                 { edit ? "Edit your task"  : "Add a task"}
                </h3>
                <button
                  type="button"
                  class="close close__btn text-left mr-5"
                  onClick={() => {
                    setDisplay(false)
                    setEdit(false)
                  }}
                >
                  <Add className="add__icon" stroke="#000000" />
                </button>
              </div>
              <div class="modal-body">
                <form onSubmit={submit} className="form__add">
                  <label >Enter Title</label>
                  <input
                    type="text"
                    required
                    name="title"
                    className="w-100 py-2"
                    defaultValue={edit ?editTitle : ""}
                    placeholder="Enter Title"
                    onChange={(e) => {
                      edit
                        ? setEditTitle(e.target.value)
                        : setTitle(e.target.value);
                    }}
                  />
                  <br />
                  <label >Enter Date</label>

                  <input
                    type="date"
                    required
                    name="date"
                    className="w-100 py-2"
                    defaultValue={edit ? editname : ""}
                    placeholder="Enter Date"
                    onChange={(e) => {
                      edit
                        ? setEditname(e.target.value)
                        : setName(e.target.value);
                    }}
                  />
                  <br />
                  <label >Enter Description</label>
                  <input
                    type="text"
                    required
                    name="desc"
                    className="w-100 py-2"
                    defaultValue={edit ? editDesc : ""}
                    placeholder="Enter Description"
                    onChange={(e) => {
                      edit
                        ? setEditDesc(e.target.value)
                        : setDesc(e.target.value);
                    }}
                  />
                  <br />
                  <br />
               <label>Enter Status:</label>
                  <div className="status__input">
                    <div className="status__wrap">
                      <input
                        type="radio"
                        required
                        id="css"
                        name="fav_language"
                        defaultChecked
                        value="true"
                        onChange={(e) => {
                          edit ? setEditStatus(true) : setStatus(true);
                        }}
                      />

                      <label for="css">Completed</label>
                    </div>
                    <div className="status__wrap">
                      <input
                        type="radio"
                        id="javascript"
                        name="fav_language"
                        value="false"
                        required
                        onChange={(e) => {
                          edit ? setEditStatus(false) : setStatus(false);
                        }}
                      />
                      <label for="javascript">To do</label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="submit__btn btn btn-primary mt-3 w-50 py-3 px-3"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
export default Home;
