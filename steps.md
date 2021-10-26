# 运行步骤: 
1. 先下载并安装Node.js: https://nodejs.org/zh-cn/download/
2. 然后打开cmd, 定位到math.js所在目录, 输入以下命令运行
```
  node ./math.js
```

文件的顶部定义了所有可变的参数
```js
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

```

如果只需要获取统计结果, 则注释掉生成题目这个函数
默认读取Answers.txt 和 Exercises.txt两个文件
```js
// 将结果写入文件
// writeQuestionsToFile(questionsAndAnswers);

// 读取 {问题} 和 {答案}  文件 => 计算并统计 并且写入到文件
writeGradesToFile(questionsFileName, answersFileName);
```



# 文档: 
node.js文档: http://nodejs.cn/api/fs.html#fs_fs_writefile_file_data_options_callback
js文档: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array

# 编辑器
vs-code编辑器: https://code.visualstudio.com