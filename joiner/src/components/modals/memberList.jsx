import React, { useReducer, useContext, useState, useEffect } from 'react';
import { useGroupContext } from '../../contexts/GroupContext';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../contexts/UserContext';
import '../../styles/memberModal.scss';
import { data } from '../../dummyData/groupUserDummy';
// import styled from 'styled-components';
// const StyledButton = styled.button`

// margin: 0 auto;

// cursor: pointer;
// // background-color: #353866;
// color: white;
// margin-top: 20px;
// border-radius: 10px;
// width: 10px;
// height: 40px;
// border-style: none;
//   &:hover {

//     color: #aaabd3;
//     cursor: pointer;
//   `;
const MemberModal = ({ isOpen, handleModal, close }) => {
  const [userInputs, setUserInputs] = useState({
    userName: '',
    email: '',
    id: '',
  });
  const [nameFilter, setNameFilter] = useState(false);

  const { state } = useUserContext();
  // const { access_token } = state;
  const { groupCurrentState, groupDispatch } = useGroupContext();
  const { group, mapping_id } = groupCurrentState;
  const { groupUser } = group;

  useEffect(() => {
    const getMembers = async () => {
      try {
        const res = await axios.get(
          'https://localhost:4000/group/groupMember',
          {
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              group_id: mapping_id,
            },
            withCredentials: true,
            crossDomain: true,
          },
        );
        groupDispatch({
          type: 'GET_GROUPMEMBERS',
          groupUser: res.data.groupUser,
        });
        console.log(res);
      } catch (err) {
        groupDispatch({ type: 'GET_ERROR', error: err });
      }
    };
    getMembers();
  }, []);

  // useEffect(() => {
  //   const getMembers = () => {
  //     groupDispatch({ type: 'GET_DATA' })
  //       const res = await axios
  //       .get('https://localhost:4000/group/groupMember', {
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //           'Content-Type': 'application/json',
  //         },
  //         withCredentials: true,
  //         crossDomain: true,
  //       })
  //       .then(res => {
  //         groupDispatch({ type: 'GET_GROUPMEMBERS', members: res.data.members })
  //       })
  //       .catch(err => {
  //         groupDispatch({ type: 'GET_ERROR', error: err})
  //       })

  //   };
  //   getMembers();
  // }, [])

  const handleChange = e => {
    const { name, value } = e.target;
    setUserInputs({ ...userInputs, [name]: value });
  };

  const searchFilter = () => {
    setNameFilter(true);
  };

  return (
    <>
      <div className="membersModal">
        <div className="groupMembersModal">
          <div className="membersContainer">
            <div className="memberInterface">
              <span id="members">회원</span>

              <button id="chat">그룹챗</button>
            </div>
            <div className="searchInterface">
              <input
                value={userInputs.userName}
                name="userName"
                className="searchbox"
                type="text"
                placeholder="이름을 검색하세요"
                onChange={handleChange}
                style={{ marginTop: '20px' }}
              />
              <button id="searchBtn" onClick={searchFilter}>
                검색
              </button>
            </div>

            <div
              className="memberList"
              style={{
                overflowY: 'scroll',
                height: '400px',
                width: '100%',
                marginTop: '20px',
              }}
            >
              <ul className="searchResults">
                {data
                  .filter(member => {
                    if (member.userName.includes(userInputs.userName)) {
                      return member;
                    }
                  })
                  .map(filteredMember => {
                    return (
                      <li>
                        <div style={{ display: 'flex' }}>
                          <div>img</div>
                          <div>{filteredMember.userName}</div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default withRouter(MemberModal);
