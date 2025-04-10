import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { motion } from "framer-motion";

export default function JEEMainsPredictor() {
  const [rank, setRank] = useState(0);
  const [category, setCategory] = useState("OPEN");
  const [homeState, setHomeState] = useState("");
  const [gender, setGender] = useState("Gender-Neutral");
  const [cutoffData, setCutoffData] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("/cutoffData_full.json")
      .then((res) => res.json())
      .then((data) => setCutoffData(data));
  }, []);

  const getQuota = (institute) => {
    const state = institute.includes("NIT") ? institute.split(" ").pop() : "";
    return state === homeState ? "HS" : "AI";
  };

  const handleSubmit = () => {
    const filtered = cutoffData.filter((item) => {
      const genderMatch = item.Gender === gender || item.Gender === "Gender-Neutral";
      const categoryMatch = item["Seat Type"] === category;
      const quotaMatch = item.Quota === getQuota(item.Institute);
      const rankMatch = rank <= item["Closing Rank"];
      return genderMatch && categoryMatch && quotaMatch && rankMatch;
    });
    setResults(filtered);
  };

  return (
    <motion.div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">JEE Mains Predictor</h1>
      <Card>
        <CardContent className="space-y-4 p-4">
          <Input
            type="number"
            placeholder="Enter your JEE Rank"
            value={rank}
            onChange={(e) => setRank(parseInt(e.target.value))}
          />
          <Select onValueChange={setCategory} defaultValue="OPEN">
            <SelectItem value="OPEN">General</SelectItem>
            <SelectItem value="OBC-NCL">OBC-NCL</SelectItem>
            <SelectItem value="SC">SC</SelectItem>
            <SelectItem value="ST">ST</SelectItem>
            <SelectItem value="EWS">EWS</SelectItem>
          </Select>
          <Input
            placeholder="Enter your Home State (e.g. Odisha)"
            value={homeState}
            onChange={(e) => setHomeState(e.target.value)}
          />
          <Select onValueChange={setGender} defaultValue="Gender-Neutral">
            <SelectItem value="Gender-Neutral">Gender-Neutral</SelectItem>
            <SelectItem value="Female-only (including Supernumerary)">Female</SelectItem>
          </Select>
          <Button className="w-full" onClick={handleSubmit}>
            Predict
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {results.length > 0 ? (
          results.map((res, idx) => (
            <Card key={idx} className="bg-green-50">
              <CardContent className="p-4">
                <p className="font-semibold">{res.Institute}</p>
                <p>{res["Academic Program Name"]}</p>
                <p>Closing Rank: {res["Closing Rank"]}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">No eligible colleges found.</p>
        )}
      </div>
    </motion.div>
  );
}
