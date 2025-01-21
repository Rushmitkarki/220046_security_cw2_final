import React, { useEffect, useState } from "react";
import { Table, Space, Spin, Alert } from "antd";
import { getUserActivityLogs } from "../../../apis/Api";

const UserLog = () => {
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token from local storage
      const response = await getUserActivityLogs({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActivityLogs(response.data.activities);
    } catch (err) {
      setError("Failed to fetch activity logs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user) => (
        <span>
          {user?.firstName} {user?.lastName} ({user?.email})
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => new Date(timestamp).toLocaleString(),
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (details) => JSON.stringify(details),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ margin: "20px" }}>
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Activity Logs</h1>
      <Table
        dataSource={activityLogs}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UserLog;
