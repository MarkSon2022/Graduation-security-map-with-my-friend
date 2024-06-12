import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import _ from "@lodash";
import { Button } from "@mui/material";
import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { baseURL } from "app/store/apiService";
import { useAppDispatch } from "app/store/hooks";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { navigateConfig } from "app/configs/navigateConfig";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";

export default function QuizHeaderAll() {
  const routeParams = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [csvData, setCsvData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);
		const requestData = result.data.map(row => ({
			name: row[0],
			imgUrl: row[1],
			email: row[2],
            orgId: row[3]
		  }));

		  axios.post(baseURL + "/mentors/import", requestData).then(response => {
			if (response.status == 200 || response.status == 201) {
				dispatch(showMessage({ message: 'Mentor Saved' , anchorOrigin: {
					vertical: 'top',
					horizontal: 'right'
				}}));
        navigateConfig('/apps/mentors');
			}
			else {
				dispatch(showMessage({ message: 'Mentor Save Failed' , anchorOrigin: {
					vertical: 'top',
					horizontal: 'right'
				}}));
				}
		  })
      .catch((error) => {
        dispatch(showMessage({ message: 'Mentor Save Failed', variant: 'error' , anchorOrigin: {
					vertical: 'top',
					horizontal: 'right'
				}}));
      })
      ;
		  
      },
    });
  };



  return (
    <div className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
      <motion.span
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
      >
        <Typography className="text-24 md:text-32 font-extrabold tracking-tight">
          Quiz
        </Typography>
      </motion.span>

      <div className="flex flex-1 items-center justify-end space-x-8">
        <motion.div
          className="flex flex-grow-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <Button
						className=""
						variant="contained"
						color="secondary"
						component={NavLinkAdapter}
						to="/apps/quiz/management"
					>
						<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
						<span className="mx-4 sm:mx-8">Create</span>
					</Button>
        </motion.div>
      </div>
    </div>
  );
}