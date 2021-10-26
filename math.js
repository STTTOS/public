// 导入文件操作模块
const fs = require('fs');

// 控制生成的题目数量
const count = 99;

// 定义运算符 加 减 乘 除
const operation = ['+', '-', '*', '/'];

// 自然数范围(左闭右开)
const NATURAL_NUMBER_RANGE = [1, 100];

// 真分数分母范围(左闭右开)
const REAL_FRACTION_DENOMINATION_RANGE = [2, 88];

// 真分数范围(左闭右开)
const REAL_FRACTION_RANGE = [1 / 25, 1 / 3];

// 最大运算符个数
const MAX_OPERATION_COUNT = 3;

// 题目中是否带括号
const allowBrackets = false;

// 题目带括号的概率
const probabilityOfWithinBrackets = 0.3;

// 文件名字
const questionsFileName = 'Exercises.txt';
const answersFileName = 'Answers.txt';
const gradeFileName = 'Grade.txt';

/**
 * 获取随机数
 * @param {*} min 最小值 (闭区间)
 * @param {*} max 最大值 (开区间)
 */
const getRandom = (min, max) => {
  return Math.floor(min + Math.random() * (max - min));
};

/**
 * 检测新生成的题目是否重复
 * @param {*} arr 已经生成的题目
 * @param {*} target 新的题目
 * @returns 
 */
const isDuplicated = (arr, target) => {
  // 如果新的题目不在 已经生成的题目中, 或者已经生成的题目为空, 则表示没有重复
  if (!arr.includes(target) || arr.length === 0) {
    return false;
  }

  // 排除前面的情况 , 表示重复了
  return true;
};

/**
 * 确保生成的分数 为真分数并且在 给定的范围内
 * @param {*} question 题目
 */
const insureRealFractionValidated = (question) => {
  const index = question.indexOf('/');

  // 分母
  const denominator = question[index + 1];
  // 分子
  const numerator = question[index - 1];

  const val = numerator / denominator;

  return (
    val < REAL_FRACTION_RANGE[1] &&
    val >= REAL_FRACTION_RANGE[0] &&
    denominator < REAL_FRACTION_DENOMINATION_RANGE[1] &&
    denominator >= REAL_FRACTION_DENOMINATION_RANGE[0]
  );
};

/**
 * 生成题目
 * @param {*} count 题目数量
 */
const getQuestions = () => {

  // 保存问题
  const questions = [];

  // 保存答案
  const answers = [];

  while (true) {
    // 除法操作符是否已经被选择
    let divideOpPicked = false;

    // 题目数量等于需要的数量, 退出循环
    if (questions.length === count) {
      break;
    }

    // 获取运算符的个数, 1 || 2 || 3 || ....
    const operationNumber = getRandom(1, MAX_OPERATION_COUNT + 1);

    // ['-']
    // ['-', '*']
    // 获取操作符, 最多允许一个 /
    const pickOperation = new Array(operationNumber)
      .fill(0)
      .map(() => {
        // 如果已经有除法操作符, 则不再选择除法操作符
        let _operation;
        if (divideOpPicked) {
          _operation = operation.filter(op => op !== '/');
        } else {
          _operation = operation;
        }

        // 随机选择操作符
        const op = _operation[getRandom(0, _operation.length)];
        if (op === '/') {
          divideOpPicked = true;
        }

        return op;
      });


    // 生成单个问题
    let question = pickOperation.reduce((acc, cur, i) => {
      if (i === 0) {
        return [getRandom(...NATURAL_NUMBER_RANGE), ...acc, cur, getRandom(...NATURAL_NUMBER_RANGE)];
      }

      return [...acc, cur, getRandom(...NATURAL_NUMBER_RANGE)];
    }, []);

    // 加括号的情况: 允许题目中出现括号, 并且有概率控制, 并且操作符至少为2个, 并且不包含除法运算
    if (
      allowBrackets &&
      Math.random() < probabilityOfWithinBrackets &&
      question.length > 3 &&
      !question.includes('/')
    ) {
      // 找到- || + 法运算符的下标
      const index = question.findIndex(item => ['+', '-'].includes(item));

      if (index !== -1) {
        question.splice(index - 1, 0, '(');
        question.splice(index + 3, 0, ')');
      }
    }


    // 将问题转化为字符串
    const questionToStr = question.join('');


    // 计算表达式的值
    const calculateValue = eval(questionToStr);

    // 判断 是否重复 && 值 >=0 
    if (
      !isDuplicated(questions, questionToStr)
      && calculateValue >= 0
      // 如果包含除法, 就要验证真分数是否符合规则
      && ((question.includes('/') && insureRealFractionValidated(question)) || !question.includes('/'))
    ) {
      questions.push(questionToStr);
      answers.push(calculateValue);
    }
  }

  return {
    questions,
    answers
  };
};

/**
 * 将题目写到文件
 * @param {*} questions 
 */
const writeQuestionsToFile = ({ questions, answers }) => {
  // 写题目
  fs.writeFileSync(
    questionsFileName,
    questions
      .map(
        (question, i) => `${i + 1}. ${question}`
      )
      .join('\n')
      .replace(/\//g, '÷')
      .replace(/\*/g, 'x'),
    err => { if (err) throw err }
  );

  // 写答案
  fs.writeFileSync(
    answersFileName,
    answers
      .map(
        (answer, i) => `${i + 1}. ${eval(answer)}`
      )
      .join('\n'),
    err => { if (err) throw err }
  );

  console.log(`题目和答案已经写入到${questionsFileName}和${answersFileName}中, 
  题目数量: ${questions.length}
  题目中是否允许括号: ${allowBrackets ? '是' : '否'}
  最大运算符个数: ${MAX_OPERATION_COUNT}
  `
  );
};

// 将统计结果写入文件
const writeGradesToFile = (questionsFilePath, answersFilePath) => {
  console.log(`读取${questionsFilePath}, ${answersFilePath}文件`);

  // 读取问题
  const questions = fs.readFileSync(questionsFilePath)
    .toString()
    .replace(/\÷/g, '/')
    .replace(/\x/g, '*')
    .split('\n')
    .map(item => eval(item.split('. ')[1].trim()));

  // 读取答案
  const answers = fs.readFileSync(answersFilePath)
    .toString()
    .split('\n')
    .map(item => +item.split('. ')[1].trim());

  const grade = answers.reduce((acc, cur, i) => {
    if (!acc.Correct) {
      acc.Correct = [];
    } else {
    }
    if (!acc.Wrong) {
      acc.Wrong = [];
    }

    if (cur === questions[i]) {
      acc.Correct.push(i + 1);
    } else {
      acc.Wrong.push(i + 1);
    }
    return acc;
  }, {});

  fs.writeFile(
    gradeFileName,
    `
Correct: ${grade.Correct.length}(${grade.Correct.join(',')})
Wrong: ${grade.Wrong.length}(${grade.Wrong.join(',')})
    `,
    err => { if (err) throw err }
  );

  console.log(`统计结果已经写入到${gradeFileName}中`);
}



// 获取问题和其对应的答案
const questionsAndAnswers = getQuestions();

// 将结果写入文件
writeQuestionsToFile(questionsAndAnswers);

// 读取 {问题} 和 {答案}  文件 => 计算并统计 并且写入到文件
writeGradesToFile(questionsFileName, answersFileName);