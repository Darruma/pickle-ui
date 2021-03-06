import { useEffect } from "react";
import { createContainer } from "unstated-next";

import { Balances } from "./Balances";
import { useFetchJars } from "./Jars/useFetchJars";
import { useJarWithAPY } from "./Jars/useJarsWithAPY";
import { useJarWithTVL } from "./Jars/useJarsWithTVL";

function useJars() {
  const { jars: rawJars } = useFetchJars();
  const { jarsWithAPY } = useJarWithAPY(rawJars);
  const { jarsWithTVL } = useJarWithTVL(jarsWithAPY);

  const { addTokens } = Balances.useContainer();

  // Automatically update balance here
  useEffect(() => {
    if (jarsWithTVL) {
      const wants = jarsWithTVL.map((x) => x.depositToken.address);
      const pTokens = jarsWithTVL.map((x) => x.contract.address);
      addTokens([...wants, ...pTokens]);
    }
  }, [jarsWithTVL]);

  // log out TVL for each jar
  // if (jarsWithTVL) {
  //   jarsWithTVL.forEach((jar) => {
  //     if (jar.tvlUSD) {
  //       console.log(
  //         `${jar.depositTokenName} Jar TVL: $${jar.tvlUSD?.toLocaleString()}`,
  //       );
  //     }
  //   });
  // }
  return { jars: jarsWithTVL };
}

export const Jars = createContainer(useJars);
