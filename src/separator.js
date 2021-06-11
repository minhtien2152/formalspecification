import dedent from "dedent";

const remove_character = (str, char_pos) => {
  const part1 = str.substring(0, char_pos);
  const part2 = str.substring(char_pos + 1, str.length);
  return part1 + part2;
};

const handleParentheses = (str) => {
  let pair_num = -1;
  let current_pair = -1;
  let pairs = [];
  let sub_Str = str;

  for (let i = 0; i < str.length; i++) {
    if (sub_Str[i] === "(") {
      pair_num += 1;
      current_pair = pair_num;
      pairs.push({ open: i, end: null });
    } else if (sub_Str[i] === ")") {
      if (current_pair === -1) {
        pairs.push({ open: null, end: i });
        pair_num += 1;
        current_pair = pair_num;
      } else {
        pairs[current_pair].end = i;
        do {
          current_pair--;
          console.log("current_pair:" + current_pair);
        } while (
          pairs[current_pair] &&
          pairs[current_pair].end !== null &&
          pairs[current_pair].open !== null
        );
      }
    }
  }

  pairs.map((pair) => {
    if (pair.end === null) sub_Str = remove_character(sub_Str, pair.open);
    else if (pair.open === null) sub_Str = remove_character(sub_Str, pair.end);
  });
  console.log(pairs);
  return sub_Str;
};
//console.log(handleParentheses(" (nam%4 = 0)    && (nam%100!=0)) "));

const postHandle = (post) => {
  let postArr = post.replace(/\n/g, "").split("||");

  postArr = postArr.map((r) => {
    const pos = r.indexOf("&&");
    console.log(pos);
    const result = r.substring(0, pos).replace(/(\(|\))/gim, "");

    const cond = r.substring(pos + 2).replace(/(\(|\))/gim, "");

    return { result, cond };
  });
  return postArr;
};
const paramsHandle = (arr) => {
  const params = arr.split(",");
  const result = params.map((param) => {
    return param.split(":");
  });
  if (result.length === 1) return result[0];
  return result;
};

export const generator = () => {
  let str = dedent`LaNamNhuan   (  nam    :   Z) kq : B    
  pre   (nam>0)
  post 
  ( 
     (kq = FALSE) && (nam%4 !=0)
  ) 
  ||
  ( 
     (kq = FALSE) && (nam%400 != 0) 
     && (nam%100=0) 
  ) ||
  ( 
     (kq = TRUE) 
     && (nam%4 = 0) 
     && (nam%100!=0)
  ) 
  ||
  ( (kq = TRUE) && (nam%400=0))
`;

  str = str.replaceAll(" ", "").split("\npre");
  const functionName = str[0].split("(")[0].trim();
  const params = str[0].split("(")[1].split(")");
  const input = paramsHandle(params[0]);
  const output = paramsHandle(params[1]);
  const preCondition = str[1].split("\npost")[0].replace(/(\(|\))/gim, "");
  let post = str[1].split("\npost")[1];
  post = postHandle(post.replace(/\n/g, ""));
  return { functionName, input, output, preCondition, post };
};

const post = dedent`( 
  (kq = FALSE) && (nam%4 !=0)
) 
||
( 
  (kq = FALSE) && (nam%400 != 0) 
  && (nam%100=0) 
) ||
( 
  (kq = TRUE) 
  && (nam%4 = 0) 
  && (nam%100!=0)
) 
||
( (kq = TRUE) && (nam%400=0))
`;

//console.log(postHandle(post));

const str = "( (kq = FALSE)";

//console.log(handleParentheses(str));
