import React, { useEffect, useState } from "react";
import requests from "./requests";

export default function ATHIV() {
  async function init() {
    const requestAnalitics = await Promise.resolve(requests.getAnalytics());
  }

  useEffect(() => {
    init();
  }, []);

  return <>ATHIV</>;
}
