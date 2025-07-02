import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const DepartmentDetails = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    const fetchDept = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/department/details/${id}`, {
        withCredentials: true,
      });
      setDepartment(res.data);
      console.log(res.data)
    };

    fetchDept();
  }, [id]);

  if (!department) return <div>Loading...</div>;

  return (
    <div className="w-full h-full px-5 py-8">
        <div className="">
            <h1 className="text-xl md:text-2xl">{department.name}</h1>
        </div>
    </div>
  );
};

export default DepartmentDetails;
