import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Typography, Box, TextField } from "@mui/material";
import RelationshipChart from "./RelationshipChart";
import { Policyholder } from "./types";

const App: React.FC = () => {
  const [policyholders, setPolicyholders] = useState<Policyholder[]>([]);
  const [selectedPolicyholder, setSelectedPolicyholder] =
    useState<Policyholder | null>(null);
  const [searchCode, setSearchCode] = useState<string>("1");

  const fetchPolicyholders = async () => {
    const response = await axios.get<Policyholder[]>(
      "http://localhost:3001/policyholders"
    );
    setPolicyholders(response.data);

    const defaultPolicyholder = findPolicyholderByCode(response.data, "1");
    if (defaultPolicyholder) {
      setSelectedPolicyholder(defaultPolicyholder);
    }
  };

  useEffect(() => {
    fetchPolicyholders();
  }, []);

  const findPolicyholderByCode = (
    policyholders: Policyholder[],
    code: string
  ): Policyholder | null => {
    for (const holder of policyholders) {
      if (holder.code === code) {
        return holder;
      }

      if (holder.l) {
        const found = findPolicyholderByCode(holder.l, code);
        if (found) return found;
      }

      if (holder.r) {
        const found = findPolicyholderByCode(holder.r, code);
        if (found) return found;
      }
    }
    return null;
  };

  const handleSearch = () => {
    const found = findPolicyholderByCode(policyholders, searchCode);
    if (found) {
      setSelectedPolicyholder(found);
    } else {
      alert("未找到保戶");
    }
  };

  const handleNodeSelect = (holder: Policyholder) => {
    setSelectedPolicyholder(holder);
    
  };

  
  return (
    <Container>
      <Typography variant="h4">保戶介紹關係系統</Typography>
      <TextField
        label="搜尋保戶編號"
        variant="outlined"
        value={searchCode}
        onChange={(e) => setSearchCode(e.target.value)}
      />
      <Button
        onClick={handleSearch}
        variant="contained"
        className="ml-2"
      >
        搜尋
      </Button>

      <Box mt={2}>
        <RelationshipChart
          policyholder={selectedPolicyholder}
          onNodeSelect={handleNodeSelect}
        />
      </Box>
    </Container>
  );
};

export default App;
