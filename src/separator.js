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

// prepare input for C# fiddle
// cannot execute readline command
export const CSharpApiEncodeStr = (s) => {
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML.replace(/<br ?\/?>/g, "")
    .replace(/"/g, "&quot;");
  return s;
}

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
  if (result.length === 1) return [result[0]];
  return result;
};

const separateFormal = (str) => {
  str = str.replaceAll(" ", "").split("\npre");
  const functionName = str[0].split("(")[0].trim();
  const params = str[0].split("(")[1].split(")");
  const input = paramsHandle(params[0]);
  const output = paramsHandle(params[1]);
  const preCondition = str[1].split("\npost")[0].replace(/(\(|\))/gim, "");
  let post = str[1].split("\npost")[1];
  post = postHandle(post.replace(/\n/g, ""));
  return { functionName, input, output, preCondition, post };
}

const getCSharpType = (str) => {
  switch (str) {
    case 'z': case 'Z': return 'float';
    case 'n': case 'N': return 'int';
    case 'r': case 'R': return 'double';
    case 'b': case 'B': return 'bool';
    case 'char*': case 'CHAR*': return 'string';
  }
  return '';
}

const getCSharpParseType = (str) => {
  switch (str) {
    case 'z': case 'Z': return 'float.Parse';
    case 'n': case 'N': return 'int.Parse';
    case 'r': case 'R': return 'double.Parse';
    case 'b': case 'B': return 'bool.Parse';
    case 'char*': case 'CHAR*': return '(string)';
  }
  return '';
}

const parseFunctionPrompt = (input, functionName) => {
  let inputPrompt = '', funcCall = functionName + '(';
  input.forEach(x => {
    inputPrompt += `Console.Write("${x[0]} = ");\n`;
    inputPrompt += `${getCSharpType(x[1])} ${x[0]} = ${getCSharpParseType(x[1])}(Console.ReadLine());\n`;
  });

  input.forEach(x => {
    funcCall += `${x[0]}, `;
  });
  if (input.length > 0)
    funcCall = `Console.WriteLine(${funcCall.slice(0, -2)}));\n`;

  
  return inputPrompt + funcCall;
}

const parseCondition = (res, cond) => {
  cond = cond.replace(/=/gi, "==");
  cond = cond.replace(/!==/gi, "!=");
  res = res.replace(/FALSE|TRUE/gi, x => x.toLowerCase());
  return `if (${cond}) ${res};\n`
}

const parsePostCond = (post) => {
  let arr = '';
  post.forEach(x => {
    arr += parseCondition(x.result, x.cond);
  });
  return arr;
}

const parseOutput = (output, mode) => {
  if (mode === 'return')
    return `return (${getCSharpType(output[0][1])})${output[0][0]};\n`
  return `object ${output[0][0]} = null;\n`;
}

const parseFuncName = (functionName, output) => {
  return `${getCSharpType(output[0][1])} ${functionName}`
}

/**
 * @param {Array} input
 */
const parseParams = (input) => {
  let res = '';
  input.forEach(x => {
    res += `${getCSharpType(x[1])} ${x[0]},`;
  });
  if (res.length > 0)
    res = res.slice(0, -1);
  
  return res;
}

export const convertToCSharp_display = (formal) => {
  const par = separateFormal(dedent(formal));
  const str = dedent`
  using System;

  public class Program
  {
    public static void Main(string[] args)
    {
      ${parseFunctionPrompt(par.input, par.functionName)}
    }

    static ${parseFuncName(par.functionName, par.output)}(${parseParams(par.input)}) {
      ${parseOutput(par.output)}
      ${parsePostCond(par.post)}
      ${parseOutput(par.output, 'return')}
    }
  }`;
  // console.log(CSharpApiEncodeStr(dedent(str))); for api query
  return dedent(str);
}

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
  console.log(separateFormal(str));
  return convertToCSharp_display(separateFormal(str));
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
