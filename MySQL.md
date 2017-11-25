# 基础知识
## 准备工作
### 数据库版本选择
#### MySQL Enterprise Edition 
- 这是MySQL的企业版，需要收费，可以免费试用30天。

#### MySQL Community Server
- 这是MySQL的社区版，免费开源，不提供官方技术支持，这是我们通常使用的版本。

#### MySQL Cluster
- 这是MySQL的集群版，开源免费，可将几个MySQL Server封装成一个Server。

#### MySQL Cluster CGE
- 高级集群版，需付费。

### 数据库下载
- 直接去MySQL的官网下载适合自己操作系统的版本即可[https://www.mysql.com/downloads/](https://www.mysql.com/downloads/)

### 数据库安装
#### Windows
- Windows下安装MySQL，如果你的安装包是msi的，基本是傻瓜式安装，按照提示一步一步往下走就行，不过有些电脑可能会提示需要安装一些库，比如：vcredist2010_x86、vstor40、dotNetFx40_Full_x86_x64。去网上下载一下，安装好之后再进行安装就行了。

#### Linux
==我用的CentOS 7 x64==
##### 方法一
- 在MySQL官网[https://dev.mysql.com/downloads/repo/yum/](https://dev.mysql.com/downloads/repo/yum/)中找到MySQL的最新版本，目前我找到的是mysql57-community-release-el7-11.noarch.rpm。
- 在终端中输入命令
```SQL
wget http://repo.mysql.com/mysql57-community-release-el7-11.noarch.rpm

rpm -ivh mysql57-community-release-el7-11.noarch.rpm

yum install mysql-server

-- 然后就开始下载安装了，其间输入几次“y”，确认即可，若命令执行过程中出现“权限不够”的错误，输入su，输入密码即可
```
- 启动MySQL服务
```SQL
service mysqld start
```
- 查看临时密码，此密码需要在第一次使用之后修改，否则会报错
```SQL
grep 'temporary password' /var/log/mysqld.log
-- 返回给我：2017-07-30T17:13:49.771799Z 1 [Note] A temporary password is generated for root@localhost: jcap,R9Q4J/j
-- “host：”后面就是临时密码

mysql -u root -p
-- 登录

SET GLOBAL validate_password_policy = 0;

SET GLOBAL validate_password_length = 1;
-- 为了让密码不受密码策略限制执行上面两句话

ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';
-- 修改密码

GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'mypassword' WITH GRANT OPTION;
FLUSH PRIVILEGES;
-- 授权其它机器登录，如果规则没有允许3306端口开放，也不能远程连接到MySQL数据库
-- 可以通过图形界面永久添加3306端口受信任，也可以通过命令来开放3306端口

打开3306端口
firewall-cmd --permanent --zone=public --add-port=3306/tcp
firewall-cmd --permanent --zone=public --add-port=3306/udp
重新加载防火墙
firewall-cmd --reload 
```

##### 方法二（未成功，求大神指点）
- 首先在官网下载安装包，我下载的是**mysql-5.7.19-linux-glibc2.12-x86_64.tar.gz**版本。然后放在了Downloads目录下。
- 使用命令进行解压及移动
```SQL
-- 进入压缩包所在目录 
cd /home/eagleye/Downloads

-- 将文件移动到另一个目录下
mv mysql-5.7.19-linux-glibc2.12-x86_64.tar.gz /usr/local

cd /usr/local

-- 解压
tar zxvf mysql-5.7.19-linux-glibc2.12-x86_64.tar.gz

-- 如果提示权限不足，则先执行su命令，输入密码获得权限
```
- 添加用户组及用户
```SQL
groupadd mysql

useradd -r -g mysql -s /bin/false mysql
```
- 建立连接并改变文件夹的拥有群组
```SQL
cd /usr/local

ln -s mysql-5.7.19-linux-glibc2.12-x86_64 mysql

cd mysql

mkdir mysql-files

chmod 750 mysql-files

chown -R mysql .

chgrp -R mysql .
```
- 安装
```SQL
mkdir data

bin/mysql_install_db --user=mysql    # MySQL 5.7.5

bin/mysqld --initialize --user=mysql # MySQL 5.7.6 and up
-- 这一步需要记住临时密码，且耐心等待

bin/mysql_ssl_rsa_setup              # MySQL 5.7.6 and up

chown -R root .

chown -R mysql data mysql-files

bin/mysqld_safe --user=mysql &
```

#### Mac
- Mac下安装MySQL，可以下载dmg格式的安装包，基本是傻瓜式安装，与Windows的msi安装包的安装方式相似，安装好之后在系统偏好设置的最下面开启服务即可。

### 数据库客户端工具选择
- MySQL客户端工具有很多比如：EMSSQL ManagerforMySQL、SQLyog、Navicat Premium、Navicat for MySQL、MySQL Workbench。基本是收费的，MySQL Workbench是官方的，分收费版和免费版，一般使用免费版就行，不过这个工具对于新手来说并不好上手。SQLyog用起来比较好上手，但是不推荐，至于原因嘛，谁用谁知道。EMSSQL ManagerforMySQL也是收费的，不过我也没用过，就不多说了，自己去体会吧。Navicat Premium和Navicat for MySQL是一家的，当然也是要收费的，而且很贵，for MySQL和Premium功能是一样的，只是Premium还同时能连MSSQL、ORACLE、PGSQL等数据库，for MySQL只能连接MySQL，当然Premium的价格也要贵很多倍。强烈推荐Navicat，因为上手容易，界面友好，方便数据的导出导入，用它来进行数据库的开发也很方便。

### 数据库连接配置
- MySQL数据库刚装上的时候，都是只允许本地连接的，如果要允许远程连接需要使用下面的语句进行操作：
```SQL
USE mysql;#使用mysql数据库，这是一个系统数据库

UPDATE user SET host = '%' WHERE user = 'root';
#"host = '%'"代表允许所有远程连接，如果想要只允许某一个远程客户端连接的话，
#改成它的IP就可以，这条语句可能执行之后会报错，但是其实执行成功了，再执行一下FLUSH PRIVILEGES就行。

FLUSH PRIVILEGES;#刷新权限
```

## 各种关键字
### SELECT
```SQL
SELECT * FROM tablename;-- 尽量不要使用

SELECT columnname1, columnname2,... FROM tablename;
```
### INSERT
```SQL
INSERT INTO tablename VALUES(value1, value2, ...);-- 给表的每一列都插入一条记录，INTO关键字可以省略

INSERT INTO tablename(columnname1, columnname2) VALUES(value1, value2);-- 给表指定列插入一条记录
```
```SQL
INSERT INTO tablename() VALUES();-- 给表的每一列都插入默认值一条记录

INSERT INTO tablename 
VALUES(value1, value2, ...), (value1, value2, ...), (value1, value2, ...), ...;-- 给表的每一列都插入n条记录

INSERT INTO tablename(columnname1, columnname2) 
VALUES(value1, value2), (value1, value2), (value1, value2), ...;-- 给表指定列插入n条记
```
```SQL
INSERT INTO tablename SET columnname = value;
-- 在SET子句中未命名的行都赋予一个缺省值，使用这种形式的 INSERT 语句不能插入多行
```
```SQL
INSERT INTO tablename(columnname1, columnname2) VALUES(value1, value1*2);
-- 一个expression可以引用在一个值表先前设置的任何列

INSERT INTO tablename(columnname1, columnname2) VALUES(value2*2, value2);
-- 这样是错误的
```
```SQL
INSERT INTO tablename1(columnname1, columnname2) 
SELECT columnname3, columnname4 FROM tablename2;
-- 使用INSERT…SELECT语句插入从其他表选择的行

INSERT INTO tablename1 
SELECT columnname3, columnname4 FROM tablename2;
-- 如果每一列都有数据,查询不能包含一个ORDER BY子句,而且INSERT语句的目的表不能出现在SELECT查询部分的FROM子句。
```
```SQL
INSERT INTO tablename(columnname1, columnname2) 
VALUES(value1, value2) 
ON DUPLICATE KEY UPDATE columnname2 = value2;
-- 假设columnname1是主键或者唯一键且value1冲突了，那么就用value2去更新

INSERT INTO tablename(columnname1, columnname2) 
VALUES(value1, value2) 
ON DUPLICATE KEY UPDATE columnname2 = VALUES(columnname2);
-- 也可以这样写
```
- INSERT IGNORE INTO …… 加上INGNORE参数之后会忽略插入时遇到的错误，如重复数据，将不返回错误，只以警告形式返回。所以使用ignore请确保语句本身没有问题，否则也会被忽略掉。

### REPLACE
- REPLACE的语法基本和INSERT一样，在此就不赘述了，不同点是如果存在PRIMARY 或者UNIQUE相同的记录，则先删除掉。再插入新记录。

### UPDATE
```SQL
UPDATE tablename SET columname1 = value1;-- 简单语法

UPDATE tablename SET columname1 = value1, columnname2 = value2, ...;-- 更新多列

UPDATE tablename SET columname1 = value1 WHERE ……;-- 带条件的更新

UPDATE tablename SET columname1 = columnname * 2;-- 带表达式的更新
```
```SQL
UPDATE tablename1 alias1, tablename2 alias2 
SET alias1.columnname1 = alias2.columnname2 
WHERE alias1.columnname3 = alias2.columnname4;
-- 用table2里面的内容去更新table1里面的内容

UPDATE tablename1 INNER JOIN tablename2 
ON tablename1.columnname1 = tablename2.columnname2 
SET tablename1.columnname3 = tablename2.columnname4;
-- 这里也可以写成关联查询的形式来更新，效果一样
```
- 注：MySQL提供了几个语句调节符，允许你修改它的调度策略，不过这一块儿涉及内容比较深就不在这里细讲了，知道就行：
1. LOW_PRIORITY关键字应用于DELETE、INSERT、LOAD DATA、REPLACE和UPDATE。
1. HIGH_PRIORITY关键字应用于SELECT和INSERT语句。
1. DELAYED关键字应用于INSERT和REPLACE语句。
### AND & OR
- AND是且，OR是或。使用的时候注意逻辑顺序，多用括号来进行调整

### BETWEEN
```SQL
SELECT * FROM tablename WHERE columnname BETWEEN num1 AND num2; 
-- 等同于
SELECT * FROM tablename WHERE columnname >= num1 AND columnname <= num2;
```
### ALIAS
- ALISA 就是AS，用于给表起别名，方便阅读和书写，在很多情况下AS也可以是被省略的。具体就不赘述了。
### ORDER BY
```SQL
SELECT * FROM tablename ORDER BY columnname;-- 简单的排序

SELECT * FROM tablename ORDER BY columnname1,columnname2, ...;
-- 按照多个列进行排序，优先排前面的
```
- 每个列后面还可以加ASC或者DESC，代表升序或者降序排列。
### LIMIT
```SQL
SELECT * FROM tablename LIMIT 5,6;
-- 选择记录从第6行开始的6行，也就是6-11行

SELECT * FROM tablename LIMIT 6;
-- 选择前6行，等价于LIMIT 0,6
```
- 注：第一个参数代表从第几行开始，0代表第一行；第二个参数代表要选多少行，而且这两个参数必须是常量不能是变量。
```SQL
SELECT * FROM tablename LIMIT 5 OFFSET 6;
-- 选择记录从第7行开始的5行，这里参数与上面的语法的参数是颠倒的
```
### DELETE & TRUNCATE
```SQL
DELETE FROM tablename;

DELETE FROM tablename WHERE ……;-- 带条件的删除表中的数据

TRUNCATE TABLE tablename;
```
#### 区别
1. TRUNCATE执行速度更快，DELETE更灵活，TRUNCATE是删除表然后重新建表，DELETE是一行一行去删除；
2. TRUNCATE返回值0，DELETE返回删除了的行数；
3. TRUNCATE恢复自增字段AUTO_INCREATEMENT初始值，DELETE不恢复；
4. DELETE支持部分数据删除，即支持 WHERE、ORDER BY和LIMIT 子句，TRUNCATE不支持，只能全部删掉表内所有数据；
5. DELETE支持事务，操作可以回滚，TRUNCATE是不能恢复的。

### DISTINCT
```SQL
SELECT DISTINCT columnname1,columnname2, ... FROM tablename;-- 基本语法
-- 注：DISTINCT关键字只能放在最前面

SELECT columnname1, COUNT(DISTINCT(columnname2)) FROM tablename;
-- 与其它函数一起使用的时候没有顺序限制
```

### LOAD DATA INFILE
==此部分内容是网上摘抄的，有些内容我也不太明白，暂时先放着，留着以后学习==
```SQL
#官方的语法释义
LOAD DATA [LOW_PRIORITY | CONCURRENT] [LOCAL] INFILE 'file_name'
    [REPLACE | IGNORE]
    INTO TABLE tbl_name
    [PARTITION (partition_name,...)]
    [CHARACTER SET charset_name]
    [{FIELDS | COLUMNS}
        [TERMINATED BY 'string']
        [[OPTIONALLY] ENCLOSED BY 'char']
        [ESCAPED BY 'char']
    ]
    [LINES
        [STARTING BY 'string']
        [TERMINATED BY 'string']
    ]
    [IGNORE number {LINES | ROWS}]
    [(col_name_or_user_var,...)]
    [SET col_name = expr,...]
```
- LOAD DATA INFILE语句从一个文本文件中以很高的速度读入一个表中。如果指定LOCAL关键词，从客户主机读文件。如果LOCAL没指定，文件必须位于服务器上。(LOCAL在MySQL3.22.6或以后版本中可用。）
- 为了安全原因，当读取位于服务器上的文本文件时，文件必须处于数据库目录或可被所有人读取。另外，为了对服务器上文件使用LOAD DATA INFILE，在服务器主机上你必须有file的权限
- 如果你指定关键词LOW_PRIORITY，LOAD DATA语句的执行被推迟到没有其他客户读取表后。使用LOCAL将比让服务器直接存取文件慢些，因为文件的内容必须从客户主机传送到服务器主机。在另一方面，你不需要file权限装载本地文件。
- 当在服务器主机上寻找文件时，服务器使用下列规则：
1. 如果给出一个绝对路径名，服务器使用该路径名。 
1. 如果给出一个有一个或多个前置部件的相对路径名，服务器相对服务器的数据目录搜索文件。 
1. 如果给出一个没有前置部件的一个文件名，服务器在当前数据库的数据库目录寻找文件。 
1. 注意这些规则意味着一个像“./myfile.txt”给出的文件是从服务器的数据目录读取，而作为“myfile.txt”给出的一个文件是从当前数据库的数据库目录下读取。也要注意，对于下列哪些语句，对db1文件从数据库目录读取，而不是db2：
```SQL
USE db1;
LOAD DATA INFILE "./data.txt" INTO TABLE db2.my_table;
```
- REPLACE和IGNORE关键词控制对现有的唯一键记录的重复的处理。如果你指定REPLACE，新行将代替有相同的唯一键值的现有行。如果你指定IGNORE，跳过有唯一键的现有行的重复行的输入。如果你不指定任何一个选项，当找到重复键键时，出现一个错误，并且文本文件的余下部分被忽略时。
- 如果你使用LOCAL关键词从一个本地文件装载数据，服务器没有办法在操作的当中停止文件的传输，因此缺省的行为好像IGNORE被指定一样。
- LOAD DATA INFILE是SELECT ... INTO OUTFILE的逆操作，
SELECT句法。为了将一个数据库的数据写入一个文件，使用SELECT ... INTO OUTFILE，为了将文件读回数据库，使用LOAD DATA INFILE。两个命令的FIELDS和LINES子句的语法是相同的。两个子句是可选的，但是如果指定两个，FIELDS必须在LINES之前。
- 如果你指定一个FIELDS子句，它的每一个子句(TERMINATED BY, [OPTIONALLY] ENCLOSED BY和ESCAPED BY)也是可选的，除了你必须至少指定他们之一。
- 如果你不指定一个FIELDS子句，缺省值与如果你这样写的相同：FIELDS TERMINATED BY '\t' ENCLOSED BY '' ESCAPED BY '\\\\'
- 如果你不指定一个LINES子句，缺省值与如果你这样写的相同：
LINES TERMINATED BY '\n' 
换句话说，缺省值导致读取输入时，LOAD DATA INFILE表现如下：
在换行符处寻找行边界； 
在定位符处将行分进字段； 
不要期望字段由任何引号字符封装；
将由“\”开头的定位符、换行符或“\”解释是字段值的部分字面字符。
- 相反，缺省值导致在写入输出时SELECT ... INTO OUTFILE表现如下：
在字段之间写定位符；
不用任何引号字符封装字段；
使用“\”转义出现在字段中的定位符、换行符或“\”字符； 
在行尾处写换行符。 
注意，为了写入FIELDS ESCAPED BY '\\\\'，对作为一条单个的反斜线被读取的值，你必须指定2条反斜线值。

- IGNORE number LINES选项可被用来忽略在文件开始的一个列名字的头：
```SQL
LOAD DATA INFILE "/tmp/file_name" into table test IGNORE 1 LINES;
```

- 当你与LOAD DATA INFILE一起使用SELECT ... INTO OUTFILE将一个数据库的数据写进一个文件并且随后马上将文件读回数据库时，两个命令的字段和处理选项必须匹配，否则，LOAD DATA INFILE将不能正确解释文件的内容。假定你使用SELECT ... INTO OUTFILE将由逗号分隔的字段写入一个文件：
```SQL
SELECT * FROM table1 INTO OUTFILE 'data.txt'
           FIELDS TERMINATED BY ','
           FROM ...
```

- 为了将由逗号分隔的文件读回来，正确的语句将是：
```SQL
LOAD DATA INFILE 'data.txt' INTO TABLE table2
           FIELDS TERMINATED BY ',';
```
- 相反，如果你试图用下面显示的语句读取文件，它不会工作，因为它命令LOAD DATA INFILE在字段之间寻找定位符：
```SQL
LOAD DATA INFILE 'data.txt' INTO TABLE table2
           FIELDS TERMINATED BY '\t';
```
- 可能的结果是每个输入行将被解释为单个的字段。

- LOAD DATA INFILE能被用来读取从外部来源获得的文件。例如，以dBASE格式的文件将有由逗号分隔并用双引号包围的字段。如果文件中的行由换行符终止，下面显示的命令说明你将用来装载文件的字段和行处理选项：
```SQL
LOAD DATA INFILE 'data.txt' INTO TABLE tbl_name
           FIELDS TERMINATED BY ',' ENCLOSED BY '"'
           LINES TERMINATED BY '\n';
```
- 任何字段或行处理选项可以指定一个空字符串('')。如果不是空，FIELDS [OPTIONALLY] ENCLOSED BY和FIELDS ESCAPED BY值必须是一个单个字符。FIELDS TERMINATED BY和LINES TERMINATED BY值可以是超过一个字符。例如，写入由回车换行符对（CR+LF）终止的行，或读取包含这样行的一个文件，指定一个LINES TERMINATED BY '\r\n'子句。

- FIELDS [OPTIONALLY] ENCLOSED BY控制字段的包围字符。对于输出(SELECT ... INTO OUTFILE)，如果你省略OPTIONALLY，所有的字段由ENCLOSED BY字符包围。对于这样的输出的一个例子(使用一个逗号作为字段分隔符)显示在下面：
```TXT
"1","a string","100.20"
"2","a string containing a , comma","102.20"
"3","a string containing a \" quote","102.20"
"4","a string containing a \", quote and comma","102.20"
```

- 如果你指定OPTIONALLY，ENCLOSED BY字符仅被用于包围CHAR和VARCHAR字段：
```TXT
1,"a string",100.20
2,"a string containing a , comma",102.20
3,"a string containing a \" quote",102.20
4,"a string containing a \", quote and comma",102.20
```

- 注意，一个字段值中的ENCLOSED BY字符的出现通过用ESCAPED BY字符作为其前缀来转义。也要注意，如果你指定一个空ESCAPED BY值，可能产生不能被LOAD DATA INFILE正确读出的输出。例如，如果转义字符为空，上面显示的输出显示如下。注意到在第四行的第二个字段包含跟随引号的一个逗号，它(错误地)好象要终止字段：
```TXT
1,"a string",100.20
2,"a string containing a , comma",102.20
3,"a string containing a " quote",102.20
4,"a string containing a ", quote and comma",102.20
```

- 对于输入，ENCLOSED BY字符如果存在，它从字段值的尾部被剥去。（不管是否指定OPTIONALLY都是这样；OPTIONALLY对于输入解释不起作用)由ENCLOSED BY字符领先的ESCAPED BY字符出现被解释为当前字段值的一部分。另外，出现在字段中重复的ENCLOSED BY被解释为单个ENCLOSED BY字符，如果字段本身以该字符开始。例如，如果ENCLOSED BY '"'被指定，引号如下处理：
```TXT
"The ""BIG"" boss" -> The "BIG" boss
The "BIG" boss      -> The "BIG" boss
The ""BIG"" boss    -> The ""BIG"" boss
```
- FIELDS ESCAPED BY控制如何写入或读出特殊字符。如果FIELDS ESCAPED BY字符不是空的，它被用于前缀在输出上的下列字符：
FIELDS ESCAPED BY字符； 
FIELDS [OPTIONALLY] ENCLOSED BY字符； 
FIELDS TERMINATED BY和LINES TERMINATED BY值的第一个字符。
ASCII 0（实际上将后续转义字符写成 ASCII'0'，而不是一个零值字节） 
如果FIELDS ESCAPED BY字符是空的，没有字符被转义。指定一个空转义字符可能不是一个好主意，特别是如果在你数据中的字段值包含刚才给出的表中的任何字符。

- 对于输入，如果FIELDS ESCAPED BY字符不是空的，该字符的出现被剥去并且后续字符在字面上作为字段值的一个部分。例外是一个转义的“0”或“N”（即，\0或\N，如果转义字符是“\”)。这些序列被解释为ASCII 0（一个零值字节）和NULL。见下面关于NULL处理的规则。

- 对于更多关于“\”- 转义句法的信息，在某些情况下，字段和行处理选项相互作用：

- 如果LINES TERMINATED BY是一个空字符串并且FIELDS TERMINATED BY是非空的，行也用FIELDS TERMINATED BY终止。
- 如果FIELDS TERMINATED BY和FIELDS ENCLOSED BY值都是空的('')，一个固定行(非限定的)格式被使用。用固定行格式，在字段之间不使用分隔符。相反，列值只用列的“显示”宽度被写入和读出。例如，如果列被声明为INT(7)，列的值使用7个字符的字段被写入。对于输入，列值通过读取7个字符获得。固定行格式也影响NULL值的处理；见下面。注意如果你正在使用一个多字节字符集，固定长度格式将不工作。
NULL值的处理有多种，取决于你使用的FIELDS和LINES选项：

- 对于缺省FIELDS和LINES值，对输出，NULL被写成\N，对输入，\N被作为NULL读入(假定ESCAPED BY字符是“\”)。
如果FIELDS ENCLOSED BY不是空的，包含以文字词的NULL作为它的值的字段作为一个NULL值被读入(这不同于包围在FIELDS ENCLOSED BY字符中的字NULL，它作为字符串'NULL'读入)。
如果FIELDS ESCAPED BY是空的，NULL作为字NULL被写入。 
用固定行格式(它发生在FIELDS TERMINATED BY和FIELDS ENCLOSED BY都是空的时候)，NULL作为一个空字符串被写入。注意，在写入文件时，这导致NULL和空字符串在表中不能区分，因为他们都作为空字符串被写入。如果在读回文件时需要能区分这两者，你应该不使用固定行格式。
一些不被LOAD DATA INFILE支持的情况：

- 固定长度的行(FIELDS TERMINATED BY和FIELDS ENCLOSED BY都为空)和BLOB或TEXT列。
如果你指定一个分隔符与另一个相同，或是另一个的前缀，LOAD DATA INFILE不能正确地解释输入。例如，下列FIELDS子句将导致问题： 
FIELDS TERMINATED BY '"' ENCLOSED BY '"'

- 如果FIELDS ESCAPED BY是空的，一个包含跟随FIELDS TERMINATED BY值之后的FIELDS ENCLOSED BY或LINES TERMINATED BY的字段值将使得LOAD DATA INFILE过早地终止读取一个字段或行。这是因为LOAD DATA INFILE不能正确地决定字段或行值在哪儿结束。
下列例子装载所有persondata表的行：
```SQL
LOAD DATA INFILE 'persondata.txt' INTO TABLE persondata;
```
- 没有指定字段表，所以LOAD DATA INFILE期望输入行对每个表列包含一个字段。使用缺省FIELDS和LINES值。

- 如果你希望仅仅装载一张表的某些列，指定一个字段表：
```SQL
LOAD DATA INFILE 'persondata.txt'
           INTO TABLE persondata (col1,col2,...);
```
- 如果在输入文件中的字段顺序不同于表中列的顺序，你也必须指定一个字段表。否则，MySQL不能知道如何匹配输入字段和表中的列。

- 如果一个行有很少的字段，对于不存在输入字段的列被设置为缺省值。

- 如果字段值缺省，空字段值有不同的解释：
对于字符串类型，列被设置为空字符串。 
对于数字类型，列被设置为0。 
对于日期和时间类型，列被设置为该类型的适当“零”值。 
如果列有一个NULL，或(只对第一个TIMESTAMP列)在指定一个字段表时，如果TIMESTAMP列从字段表省掉，TIMESTAMP列只被设置为当前的日期和时间。

- 如果输入行有太多的字段，多余的字段被忽略并且警告数字加1。

- LOAD DATA INFILE认为所有的输入是字符串，因此你不能像你能用INSERT语句的ENUM或SET列的方式使用数字值。所有的ENUM和SET值必须作为字符串被指定！

- 如果你正在使用C API，当LOAD DATA INFILE查询完成时，你可通过调用API函数mysql_info()得到有关查询的信息。信息字符串的格式显示在下面：

    Records: 1 Deleted: 0 Skipped: 0 Warnings: 0
    
    当值通过INSERT语句插入时，在某些情况下出现警告，除了在输入行中有太少或太多的字段时，LOAD DATA INFILE也产生警告。警告没被存储在任何地方；警告数字仅能用于表明一切是否顺利。如果你得到警告并且想要确切知道你为什么得到他们，一个方法是使用SELECT ... INTO OUTFILE到另外一个文件并且把它与你的原版输入文件比较。

### WHERE
```SQL
SELECT 列名称 FROM 表名称 WHERE 列 运算符 值;-- 基本语法

SELECT * FROM Persons WHERE FirstName = 'Bush'; -- 例子1，FirstName是字符串类型

SELECT * FROM Persons WHERE Year > 1965; -- 例子2，Year是数字类型
```
### LIKE
```SQL
SELECT column_name(s)
FROM table_name
WHERE column_name LIKE pattern; -- 基本语法

SELECT * FROM Persons
WHERE City NOT LIKE '%lon%'; -- 列子，匹配名字里面不带‘lon’的城市
```

## 数据库的注释符
### 方法一
#...
### 方法二
"-- ..." (注意--后面有一个空格)
### 方法三
/\*...*/

## 数据库的通配符
- 在搜索数据库中的数据时，SQL通配符可以替代一个或多个字符。SQL 通配符必须与 LIKE 运算符一起使用。
- %：表示任意个或多个字符。可匹配任意类型和长度的字符。
- _：表示任意单个字符。匹配单个任意字符,可以用来限制字符长度。
- 如果需要模糊查询去匹配'%'或者'_'，那么需要用到转义字符'/'与ESCAPE关键字。例如下面的语句：
```SQL
SELECT * FROM tablename WHERE columnname LIKE '/_%' ESCAPE '/';
-- 此处匹配以'_'开头的所有项
```
- 正则模式：正则在这里我就不赘述是什么了。MySQL支持正则表达式来模糊查询使用REGEXP（也叫RLIKE），下面来举两个例子：
```SQL
SELECT * FROM tablename WHERE columnname RLIKE '[0-9]';-- 匹配任何带数字的项

SELECT * FROM tablename WHERE columnname REGEXP '1*';-- 匹配任何带'1'的项
```
## 数据库DATABASE
### 创建数据库
```SQL
CREATE DATABASE dbname;-- 创建数据库

CREATE DATABASE dbname 
DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
-- 创建数据库并设置默认字符集及排序规则

CREATE DATABASE IF NOT EXISTS dbname 
DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
-- 覆盖式创建数据库
```
### 修改数据库
```SQL
ALTER DATABASE dbname 
CHARACTER SET utf8 COLLATE utf8_general_ci;
-- 修改数据库的字符集及排序规则
```
### 删除数据库
```SQL
DROP DATABASE dbname;-- 删除数据库

DROP DATABASE IF EXISTS dbname;-- 删除数据库如果存在
```
### 数据库相关查询
```SQL
SHOW CHARACTER SET;-- 查看MySQL字符集

SHOW COLLATION;-- 查看MySQL排序规则

SHOW DATABASES;-- 查看所有数据库

USE dbname;-- 使用某个数据库
```

## 约束(CHECK)
### 外键
- FOREIGN KEY 约束用于预防破坏表之间连接的行为。
- FOREIGN KEY 约束也能防止非法数据插入外键列，因为它必须是它指向的那个表中的值之一。
- 保持数据的完整性、一致性。
- 如果一个字段是某个表的外键，那么该字段必须是主键。
- 对于从表来说，外键不一定需要作为从表的主键，外键也不一定是外表的主键，外表的唯一键就可以作为从表的外键。
![image](http://note.youdao.com/yws/api/personal/file/WEB8eabe45bcc9e21b33a370005167c8761?method=download&shareKey=69246f4d864c4b1b3c6853c951f868ff)

### 其它约束
- **主键(PRIMARY KEY)** 是用于约束表中的一行，作为这一行的标识符，在一张表中通过主键就能准确定位到一行，因此主键十分重要。主键要求这一行的数据不能有重复且不能为空。还有一种特殊的主键——复合主键。主键不仅可以是表中的一列，也可以由表中的两列或多列来共同标识。

- **默认值约束(DEFAULT)** 规定，当有DEFAULT约束的列，插入数据为空时该怎么办。DEFAULT约束只会在使用INSERT语句时体现出来，INSERT语句中，如果被DEFAULT约束的位置没有值，那么这个位置将会被DEFAULT的值填充。

- **唯一约束(UNIQUE)** 比较简单，它规定一张表中指定的一列的值必须不能有重复值，即这一列每个值都是唯一的。当INSERT语句新插入的数据和已有数据重复的时候，如果有UNIQUE约束，则INSERT失败。

- **非空约束(NOT NULL)** 听名字就能理解，被非空约束的列，在插入值时必须非空。在MySQL中违反非空约束，不会报错，只会有警告。

## MySQL数据类型（常用）
### 数值类型

类型 | 大小（BYTE） | 范围（有符号） | 范围（无符号） | 用途
---|---|---|---|---
TINYINT | 1 | (-128，127) | (0，255) | 小整数值 |
SAMLLINT | 2 | (-32 768，32 767) | (0，65 535) | 大整数值 |
MEDIUMINT | 3 | (-8 388 608，8 388 607) | (0，16 777 215) | 大整数值 |
INT或INTEGER | 4 | (-2 147 483 648，2 147 483 647) | (0，4 294 967 295) | 大整数值 |
BIGINT | 8 | (-9 233 372 036 854 775 808，9 223 372 036 854 775 807) | (0，18 446 744 073 709 551 615) | 极大整数值 |
FLOAT | 4 | (-3.402 823 466 E+38，-1.175 494 351 E-38)，0，(1.175 494 351 E-38，3.402 823 466 351 E+38)  | (1.175 494 351 E-38，3.402 823 466 E+38) | 单精度浮点数值 |
DOUBLE | 8 | (-1.797 693 134 862 315 7 E+308，-2.225 073 858 507 201 4 E-308)，0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 双精度浮点数值 |
DECIMAL | 对DECIMAL(M,D) ，如果M>D，为M+2否则为D+2 | 依赖于M和D的值 | 依赖于M和D的值 | 小数值 |
### 日期与时间类型
类型 | 大小（BYTE） | 范围 | 格式 | 用途
---|---|---|---|---
DATE | 3 | 0000-01-01/9999-12-31 | YYYY-MM-DD | 日期值 |
TIME | 3 | '-838:59:59'/'838:59:59' | HH:MM:SS | 时间值或持续时间 |
YEAR | 1 | 1901/2155 | YYYY | 年份值 |
DATETIME | 8 | 1000-01-01 00:00:00/9999-12-31 23:59:59 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值 |
TIMESTAMP | 4 | 1970-01-01 00:00:00/2037 年某时 | YYYYMMDD HHMMSS | 混合日期和时间值，时间戳 |
### 字符串类型
类型 | 大小（BYTE） | 用途
---|---|---
CHAR | 0-255 | 定长字符串 |
VARCHAR | 0-65535 | 变长字符串 |
TINYBLOB | 0-255 | 不超过 255 个字符的二进制字符串 |
TINYTEXT | 0-255 | 短文本字符串 |
BLOB | 0-65 535 | 二进制形式的长文本数据串 |
TEXT | 0-65 535 | 长文本数据 |
MEDIUMBLOB | 0-16 777 215 | 二进制形式的中等长度文本数据 |
MEDIUMTEXT | 0-16 777 215 | 中等长度文本数据 |
LONGBLOB | 0-4 294 967 295 | 二进制形式的极大文本数据 |
LONGTEXT | 0-4 294 967 295 | 极大文本数据 |
## 表TABLE
### 创建数据库中的表
- 注：tablename也可以是dbname.tablename
```SQL
-- 创建表
CREATE TABLE tablename
(
columnname1 datatype, 
columnname2 datatype, 
columnname3 datatype, 
columnname4 datatype, 
...
);
```
```SQL
-- 覆盖式创建表
CREATE TABLE IF NOT EXISTS tablename
(
columnname1 datatype, 
columnname2 datatype, 
columnname3 datatype, 
columnname4 datatype, 
...
);
```
```SQL
-- 带单一主键创建表
CREATE TABLE tablename
(
columnname1 datatype NOT NULL, 
columnname2 datatype, 
columnname3 datatype, 
columnname4 datatype, 
PRIMARY KEY (columname1)
);
```
```SQL
-- 带多主键主键创建表
CREATE TABLE tablename
(
columnname1 datatype NOT NULL, 
columnname2 datatype NOT NULL, 
columnname3 datatype, 
columnname4 datatype, 
PRIMARY KEY (columname1, columnname2)
);
```
```SQL
-- 带普通、唯一索引及约束创建表
CREATE TABLE tablename
(
columnname1 datatype NOT NULL, 
columnname2 datatype NOT NULL, 
columnname3 datatype, 
columnname4 datatype, 
PRIMARY KEY (columname1), 
INDEX indexname1 USING BTREE (columnname2, columname3),
UNIQUE indexname2 USING BTREE(columnname4)
);
```
```SQL
-- 带主键、外键创建表
CREATE TABLE tablename
(
columnname1 datatype NOT NULL, 
columnname2 datatype NOT NULL, 
columnname3 datatype, 
columnname4 datatype, 
PRIMARY KEY (columname1), 
CONSTRAINT foreignkeyname FOREIGN KEY (columnname1) REFERENCES tablename2 (columnname5) 
ON UPDATE SET NULL ON DELETE SET NULL
);
-- 注：最后的参数的意思是：CASCADE（级联）、SET NULL（设空）、NO ACTION（无操作）、RESTRICT（约束）
```
```SQL
-- 带comment、默认字符集及默认值等创建表
CREATE TABLE tablename
(
columnname1 datatype CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT  'comment', 
columnname2 datatype, 
columnname3 datatype, 
columnname4 datatype, 
...
) COMMENT = 'comment';
```
```SQL
-- 带引擎及默认字符集等创建表
CREATE TABLE tablename
(
columnname1 datatype, 
columnname2 datatype, 
columnname3 datatype, 
columnname4 datatype, 
...
) ENGINE = 'InnoDB' DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
```
```SQL
CREATE TABLE new_tablename SELECT * FROM old_tablename;
-- 用现有的表创建一个新表，同时插入数据
```
```SQL
CREATE TABLE new_tablename(newcolumnname datatype, ...) 
SELECT columnname1,columnname2, … FROM old_tablename;
-- 将现有表的某几个字段附加到新表新字段右边，同时插入数据
```
```SQL
CREATE TABLE new_tablename LIKE old_tablename;
-- 根据其它表的定义（包括在原表中定义的所有的列属性和索引），使用LIKE创建一个空表
```
```SQL
-- 创建临时表
CREATE TEMPORARY TABLE tablename
(
columnname1 datatype, 
columnname2 datatype, 
columnname3 datatype, 
columnname4 datatype, 
...
);
-- 注：在创建表格时，您可以使用TEMPORARY关键词。
-- 只有在当前连接情况下，TEMPORARY表才是可见的。
-- 当连接关闭时，TEMPORARY表被自动取消。
-- 这意味着两个不同的连接可以使用相同的临时表名称，同时两个临时表不会互相冲突，
-- 也不与原有的同名的非临时表冲突。（原有的表被隐藏，直到临时表被取消时为止。）
-- 您必须拥有CREATE TEMPORARY TABLES权限，才能创建临时表。
-- 临时表只能被SELECT一次，不能多次SELECT。
```
```SQL
-- 覆盖式创建临时表
CREATE TEMPORARY TABLE IF NOT EXISTS tablename
(
columnname1 datatype, 
columnname2 datatype, 
columnname3 datatype, 
columnname4 datatype, 
...
);
```
### 修改表
```SQL
ALTER TABLE oldtablename RENAME newtablename;-- 重命名表名

ALTER TABLE tablename ADD columnname datatype;-- 增加列

ALTER TABLE tablename DROP COLUMN columnname;-- 删除表中某一列

ALTER TABLE tablename CHANGE COLUMN oldcolumnname newtablename datatype;
-- 修改表中某一列，也可以修改约束和comment等

ALTER TABLE tablename CHANGE COLUMN oldcolumnname newtablename datatype AFTER columnname;
-- 修改表中某一列并把其顺序改变

ALTER TABLE tablename ADD PRIMARY KEY (columnname1, columnname2);-- 增加主键

ALTER TABLE tablename DROP PRIMARY KEY, ADD PRIMARY KEY (columnname1, columnname2);
-- 增加主键，废弃原主键

ALTER TABLE tablename ADD INDEX indexname USING BTREE (columnname2(length), columname3(length));
-- 增加普通索引,如果不是字符串类型不需要加length

ALTER TABLE tablename DROP INDEX indexname, ADD INDEX indexname 
USING BTREE (columnname2(length), columname3(length));
-- 修改原来的索引

ALTER TABLE tablename1 ADD CONSTRAINT foreignkeyname 
FOREIGN KEY (columnname1) REFERENCES tablename2 (columnname2) 
ON UPDATE CASCADE ON DELETE CASCADE;
-- 修改外键

ALTER TABLE tablename DROP FOREIGN KEY foreignkeyname;-- 删除外键
```
### 删除表
```SQL
DROP TABLE tablename;-- 删除表

DROP TABLE IF EXISTS tablename;-- 删除表，如果存在
```
### 表相关查询
```SQL
SHOW FULL COLUMNS from tablename;-- 查看表所有列

SHOW TABLES;-- 查看所有表

SHOW CREATE TABLE tablename;-- 查看某表的定义

DESCRIBE tablename;-- 显示表列相关信息
```
# 进阶内容
## UNION相关的联合查询
### UNION
- UNION会把两个或者两个以上的结果集纵向联结在一起，并合并重复行（必须每一列都一样才会被判定为重复而被合并），这两个结果集的列数必须一样，但是对应列的数据类型可以是不一样的，联合之后的结果集的列名和第一个结果集相同。
```SQL
SELECT columnname1 FROM tablename1
UNION 
SELECT columnname2 FROM tablename2;
```
- 每个结果集都可以带ORDER BY子句，但是必须带括号，而且必须要加上LIMIT子句，ORDER BY才会生效。
```SQL
(SELECT columnname1 FROM tablename1 ORDER BY columnname1 LIMIT 0,5)
UNION 
(SELECT columnname2 FROM tablename1 ORDER BY columnname2 DESC LIMIT 0,10);
```
### UNION ALL
- UNION ALL与UNION相似，只是不会合并任何重复行
```SQL
SELECT columnname1 FROM tablename1
UNION ALL
SELECT columnname2 FROM tablename2;

(SELECT columnname1 FROM tablename1 ORDER BY columnname1 LIMIT 0,5)
UNION ALL
(SELECT columnname2 FROM tablename1 ORDER BY columnname2 DESC LIMIT 0,10);
```
## JOIN相关的关联查询
### INNER JOIN
```SQL
SELECT * FROM tableA INNER JOIN tableB ON tableA.columnname1 = tableB.columnname2;
-- 内连接，也叫等值连接
```
![image](http://note.youdao.com/yws/api/personal/file/WEBfd54d3d24cdde3440b38f1eb3d67eee5?method=download&shareKey=55e60bb9a9dcf15b59483e66902255e3)
### LEFT JOIN
- 左连接从左表(A)产生一套完整的记录,与匹配的记录(右表(B)) .如果没有匹配,右侧将包含NULL。
```SQL
SELECT * FROM tableA LEFT JOIN tableB ON tableA.columnname1 = tableB.columnname2;
-- 左连接，等同于LEFT OUTER JOIN
```
![image](http://note.youdao.com/yws/api/personal/file/WEB343bbcfeb820536e187dda24fae6356c?method=download&shareKey=f2797dbe7861b70923e980615a075480)
- 如果想只从左表(A)中产生一套记录，但不包含右表(B)的记录，可以通过设置WHERE语句来执行
```SQL
SELECT * FROM tableA LEFT JOIN tableB ON tableA.columnname1 = tableB.columnname2 
WHERE tableB.columnname2 IS NULL;
```
![image](http://note.youdao.com/yws/api/personal/file/WEBb0ff83699fcb2e1636e56aada575bee8?method=download&shareKey=c8787465157e898272b6327286f5c2e8)
### RIGHT JOIN
- 右连接从右表(B)产生一套完整的记录,与匹配的记录(左表(A)) .如果没有匹配,左侧将包含NULL。
```SQL
SELECT * FROM tableA RIGHT JOIN tableB ON tableA.columnname1 = tableB.columnname2;
-- 右连接，等同于RIGHT OUTER JOIN
```
![image](http://note.youdao.com/yws/api/personal/file/WEB920218c9913bac79a419c77b87e48b26?method=download&shareKey=2df226a10b37d44fb0979755bcf5b359)
- 如果想只从右表(B)中产生一套记录，但不包含左表(A)的记录，可以通过设置WHERE语句来执行
```SQL
SELECT * FROM tableA RIGHT JOIN tableB ON tableA.columnname1 = tableB.columnname2 
WHERE tableA.columnname1 IS NULL;
```
![image](http://note.youdao.com/yws/api/personal/file/WEB76fa27d35f8589d79de6a7b3412a9006?method=download&shareKey=a17897f03fa736245e3d0be5ee7982d3)
### 差集
```SQL
SELECT * FROM tableA LEFT JOIN tableB ON tableA.columnname1 = tableB.columnname2 
WHERE tableB.columnname2 IS NULL
UNION
SELECT * FROM tableA RIGHT JOIN tableB ON tableA.columnname1 = tableB.columnname2 
WHERE tableA.columnname1 IS NULL;
```
![image](http://note.youdao.com/yws/api/personal/file/WEB219714b80c4043a0128cbbb6cf744678?method=download&shareKey=ad5db1cd073175b85d2524c42ebcf75c)
### FULL JOIN
- 在MySQL里面其实是不支持FULL JOIN的，要实现FULL JOIN请使用下面的查询：
```SQL
SELECT * FROM tableA LEFT JOIN tableB ON tableA.columnname1 = tableB.columnname2
UNION
SELECT * FROM tableA RIGHT JOIN tableB ON tableA.columnname1 = tableB.columnname2;
-- 全连接产生的所有记录（双方匹配记录）在表A和表B。如果没有匹配,则对面将包含NULL。
```
![image](http://note.youdao.com/yws/api/personal/file/WEB560ab98f02d03329d8521f8e40bd7c9a?method=download&shareKey=f0b2cc76bd24da0921e63f45b8824bef)
### CROSS JOIN
- 事实上在MySQL里面CROSS JOIN、JOIN、INNER JOIN是等价的，而且在不加ON条件的情况下，这三种查询得到的结果都是一个笛卡尔积，也就是两个表的乘积。
### STRAIGHT_JOIN
- STRAIGHT_JOIN与INNER JOIN实际上是等同的，不同的是使用了 STRAIGHT_JOIN 后，tableA 会先于 tableB 载入。MySQL 在执行 INNER JOIN的时候，会根据自己内部的优化规则来决定先载入 tableA 还是 tableB，如果您确认 MySQL 载入表的顺序并不是最优化的时候，就可以使用 STRAIGHT_JOIN 以替代 INNER JOIN。
```SQL
SELECT * FROM tableA STRAIGHT_JOIN tableB ON tableA.columnname1 = tableB.columnname2;
#STRAIGHT_JOIN 无法应用于LEFT JOIN或RIGHT JOIN。
```
### NATURAL JOIN
- 使用 NATURAL JOIN时，MySQL将表中具有相同名称的字段自动进行记录匹配，而这些同名字段类型可以不同。因此，NATURAL JOIN 不用指定匹配条件。NATURAL JOIN默认是同名字段完全匹配的INNER JOIN，也可以使用 LEFT JOIN 或 RIGHT JOIN。
```SQL
SELECT * FROM tableA NATURAL JOIN tableB;

SELECT * FROM tableA NATURAL LEFT JOIN tableB;

SELECT * FROM tableA NATURAL RIGHT JOIN tableB;
```
## 视图
- 视图即是虚拟表，也称为派生表，因为它们的内容都派生自其它表的查询结果。虽然视图看起来感觉和基本表一样，但是它们不是基本表。基本表的内容是持久的，而视图的内容是在使用过程中动态产生的。
- 使用视图的优点：
1. 可靠的安全性,通过视图用户只能查询和修改他们所能见到的数;
1. 查询性能提高;
1. 有效应对灵活性的功能需求;
1. 轻松应对复杂的查询需求;
1. 逻辑数据独立性,视图可以使应用程序和数据库表在一定程度上独立。
```SQL
CREATE VIEW viewname AS SELECT ……;-- 基本语法

-- 例1
CREATE VIEW viewname AS SELECT columnname1,coluname2 FROM tablename1;

-- 例2
CREATE VIEW viewname AS 
SELECT tableA.columname1, tableA.columnname2, tableB.columname4 
FROM tableA INNER JOIN tableB 
ON tableA.columname1 = tableB.columnname3;
```
## GROUP BY相关
- 以下内容咱们以一个雇员表(employee)为例子，表结构如下：

 id | name | dep | pos | sal |  
---|---|---|---|---
 1 | abcd | 01 | 01 | 1000  
 2 | eefs | 01 | 02 | 2000 
 3 | micro | 02 | 01 | 1500 
 4 | cathey | 02 | 02 | 3000  
 5 | amy | 03 | 01 | 2500  
 6 | lily | 03 | 02 | 2200  
 7 | bobo | 01 | 01 | 2000 
 8 | gray | 01 | 02 | 1900 
 9 | leon | 03 | 02 | 2900 
 10 | sun | 02 | 02 | 1900
### GROUP BY
- GROUP BY 语句根据一个或多个列对结果集进行分组，把同一组数据合并到一条记录里面。
在分组的列上我们可以使用 COUNT, SUM, AVG等聚合函数。值得注意的是，我们要SELECT的列如果不在GROUP BY的列里面又没用使用聚合函数进行取值，很可能会报错。
```SQL
SELECT columnname1, function(columnname2), ... FROM tablename 
WHERE columnname operator value 
GROUP BY columnname1;-- 基本语法
```
```SQL
SELECT dep, pos, AVG(sal) FROM employee GROUP BY dep, pos;
-- 可以按照部门和职位进行分组，计算每个部门，每个职位的工资平均值
```
 dep | pos | AVG(sal)  
---|---|--- 
01 | 01 | 1500.0000 
01 | 02 | 1950.0000  
02 | 01 | 1500.0000  
02 | 02 | 2450.0000  
03 | 01 | 2500.0000  
03 | 02 | 2550.0000

### WITH ROLLUP
- 如果我们要对一组数据进行分组，那么我们直接用GROUP BY就行了，这样就会给我们返回一组根据所有列聚合之后的数据集，但是如果我们既想要这个结果又想要根据其中某一列聚合的结果，那就必须增加WIHT ROLLUP语句了。
 ```SQL
SELECT columnname1, function(columnname2), ... FROM tablename 
WHERE columnname operator value 
GROUP BY columnname1 WITH ROLLUP;-- 基本语法
```
```SQL
SELECT dep, pos, AVG(sal) FROM employee GROUP BY dep, pos WITH ROLLUP;
-- 我们希望再显示部门的平均值和全部雇员的平均值
```
 dep | pos | AVG(sal)  
---|---|--- 
01 | 01 | 1500.0000  
01 | 02 | 1950.0000  
01 | NULL | 1725.0000  
02 | 01 | 1500.0000  
02 | 02 | 2450.0000  
02 | NULL | 2133.3333  
03 | 01 | 2500.0000  
03 | 02 | 2550.0000  
03 | NULL | 2533.3333  
NULL | NULL | 2090.0000

### HAVING子句
HAVING与WHERE的作用非常相似，都是用来就行数据筛选的，只是作用的对象不一样。WHERE作用的是表和视图，而HAVING是作用于组的，是可以包含聚集函数的，而WHERE是不行的。
 ```SQL
SELECT columnname1, function(columnname2), ... FROM tablename 
WHERE columnname operator value 
GROUP BY columnname1 
HAVING function(columname2) operator value;-- 基本语法
```
```SQL
SELECT dep, pos, AVG(sal) FROM employee GROUP BY dep, pos
HAVING AVG(sal) > 2000;
-- 可以按照部门和职位进行分组，计算每个部门，每个职位的工资平均值，并筛出平均工资大于2000的
```
 dep | pos | AVG(sal)  
---|---|--- 
02 | 02 | 2450.0000  
03 | 01 | 2500.0000  
03 | 02 | 2550.0000
### 聚合函数
- 所谓聚合函数就是对一组值执行计算，并返回单个值。除了 COUNT 以外，聚合函数都会忽略空值。 聚合函数经常与 SELECT 语句的 GROUP BY 子句一起使用。
- COUNT():用来统计记录的条数
- SUM():是求和函数 
- AVG():是求平均值的函数
- MAX():是求最大值的函数 
- MIN():是求最小值的函数
- **GROUP_CONCAT()**:把合成该组的所有记录连成一个字符串，每个记录中间用逗号隔开
- 注：以上几个聚合函数是用的比较多的，聚合函数还有很多，就不在此一一列举了。

## 子查询与嵌套查询
### 子查询
- 当一个查询是另一个查询的条件时，称之为子查询。
#### 子查询关键字
##### IN 和 NOT IN
```SQL
SELECT * FROM userinfo 
WHERE username IN(SELECT username FROM specialuser);
-- 筛选出所有在specialuser表里面的user的info

SELECT * FROM userinfo 
WHERE username IN('user1','user2','user3');
-- 选出这三个人的相关信息
-- 注：IN 等同于 = ANY

SELECT * FROM userinfo 
WHERE username NOT IN('user1','user2','user3');
-- 选出除了这三个人之外的所有人的相关信息
-- 注：NOT IN 等同于 != ALL
```
##### ANY(等同于SOME) 
```SQL
SELECT * FROM tableA 
WHERE id = ANY(SELECT id FROM tableB);
-- 选出A表中与B表id相同的行

SELECT * FROM tableA 
WHERE id > ANY(SELECT id FROM tableB);
-- A表中某行的id只要大于B表中的任一行的id就会被选出
```
##### ALL
```SQL
SELECT * FROM tableA 
WHERE id > ALL(SELECT id FROM tableB);
-- A表中某行id要大于B表中的全部id，这条数据才会被选出
```
##### EXISTS 和 NOT EXISTS
```SQL
SELECT * FROM tableA 
WHERE EXISTS(SELECT * FROM tableB WHERE id <= 2);
-- EXISTS只会返回逻辑的TRUE或者FALSE，不返回任何数据。
-- 那么如果B表存在满足条件的数据，那么EXISTS就会返回TRUE，那么此时就会把A表所有数据都查询出来。

SELECT * FROM tableA 
WHERE EXISTS(SELECT * FROM tableB WHERE tableA.id = tableB.id);
-- 这样只要A表中的id在B表中存在，那么此条记录就会被查询出来。
-- 注：NOT EXISTS是EXISTS取反。IN也能实现EXISTS一样的查询，但是
-- EXISTS的效率比IN查询要高，因为IN不走索引，但要看实际情况具体使用，
-- IN适合于外表数据量大而内表数据小的情况；EXISTS适合于外表小而内表大的情况。
```
#### 标量子查询
- 是指子查询返回的是单一值的标量，如一个数字或一个字符串，也是子查询中最简单的返回形式。例子：
```SQL
SELECT * FROM article 
WHERE uid = (SELECT uid FROM user WHERE status=1 ORDER BY uid DESC LIMIT 1);

SELECT * FROM t1 
WHERE column1 = (SELECT MAX(column2) FROM t2);

SELECT * FROM article AS t 
WHERE 2 = (SELECT COUNT(*) FROM article WHERE article.uid = t.uid);
```
#### 列子查询
- 指子查询返回的结果集是 N 行一列，该结果通常来自对表的某个字段查询返回。例子：
```SQL
SELECT * FROM article WHERE uid IN(SELECT uid FROM user WHERE status=1);

SELECT s1 FROM table1 WHERE s1 > ANY (SELECT s2 FROM table2);

SELECT s1 FROM table1 WHERE s1 > ALL (SELECT s2 FROM table2);
```
#### 行子查询
- 指子查询返回的结果集是一行 N列，该子查询的结果通常是对表的某行数据进行查询而返回的结果集。例子：
```SQL
SELECT * FROM table1 
WHERE (1,2) = (SELECT column1, column2 FROM table2);
-- 注：(1,2) 等同于 row(1,2)

SELECT * FROM article 
WHERE (title,content,uid) = (SELECT title,content,uid FROM blog WHERE bid=2);
```
#### 表子查询
- 指子查询返回的结果集是 N 行 N 列的一个表数据。例子：
```SQL
SELECT * FROM article 
WHERE (title,content,uid) IN (SELECT title,content,uid FROM blog);
```
### 嵌套查询
- 包含一个或多个子查询或者子查询的另一个术语的 SELECT 语句。
- 在一个SELECT 语句的WHERE 子句或HAVING 子句中嵌套另一个SELECT 语句的查询称为嵌套查询，又称子查询。

## 索引
- 最基本作用就是加速查询，优化查询。MySQL只对<，<=，=，>，>=，BETWEEN，IN，以及某些时候的LIKE才会使用索引，在以通配符%和_开头作查询时，MySQL不会使用索引。

### 普通索引
- 这是最基本的索引，它没有任何限制。如果是CHAR，VARCHAR类型，length可以小于字段实际长度；如果是BLOB和TEXT类型，必须指定 length。
```SQL
CREATE INDEX indexname ON tablename(columnname(length));-- 创建普通索引
```
### 主键索引
- 它是一种特殊的唯一索引，不允许有空值。一般是在建表的时候同时创建主键索引。
### 唯一索引
- 与普通索引类似，不同的就是：索引列的值必须唯一，但允许有空值。如果是组合索引，则列值的组合必须唯一。
```SQL
CREATE UNIQUE INDEX indexname ON tablename(columnname(length));-- 创建普通索引
```
### 组合索引
- 就是比单列索引多几个字段。组合索引在使用的时候是有顺序的只会从，最多端开始使用，例如下面的语句，如果查询条件是
WHERE columnname2 = ‘xxx’或者WHERE columnname2 = ‘xxx’ AND columnname3 = ‘xxx’，那么这个查询里面就不会用到索引，如果查询条件是WHERE columnname1 = ‘xxx’或者WHERE columnname1 = ‘xxx’ AND columnname2 = ‘xxx’，那么索引才是有效的。
```SQL
CREATE INDEX indexname ON tablename(columnname1(length),columnname2(length),columnname3(length), ...);
-- 创建组合索引
```

### 全文索引
- 文字字段上的普通索引只能加快对出现在字段内容最前面的字符串（也就是字段内容的开头的字符）进行检索操作。如果字段里存放的是由几个、甚至多个单词构成的较大段的文字，普通索引就没有什么作用了。这种检索往往以LKIE '%word%'的形式出现，这对MySQL来说很复杂，如果需要处理的数据量很大，响应时间就会很长。
- 这类场合正式全文索引（FULL-TEXT INDEX）可以大显身手的地方。在生成这种类型的索引时，MySQL将把在文本中出现的所有单词创建一份清单，查询操作将根据这份清单去检索有关的数据记录。全文索引即可以随数据表一同创建，也可以等日后有必要的时候再创建。
- 有了全文索引就可以用SELECT查询命令去检索那些包含着一个或者多个给定单词的数据记录了。下面是这类查询命令的基本语法：
SELECT * FROM tablename WHERE MATCH(columnname1, columnname2) AGAINST('word1', 'word2', 'word3’)
上面这条命令将把columnname1和columnname2字段里有word1、word2、word3的数据记录全部查询出来。
- 注：InnoDB引擎不支持全文索引，全文索引只有MyISAM引擎支持。
```SQL
ALTER TABLE tablename ADD FULLTEXT(columnname1, columnname2);-- 修改表，创建全文索引

CREATE FULLTEXT INDEX indexname ON tablename(columnname1, columnname2);-- 创建全文索引
```
### 全文索引查询举例
```SQL
-- 查找product_name,description均包含Lenovo的记录
SELECT * FROM product WHERE MATCH(product_name,description) AGAINST('Lenovo');
 
-- + 表示AND，即必须包含。- 表示NOT，即不包含。
SELECT * FROM articles WHERE MATCH (title,body) AGAINST ('+apple -banana' IN BOOLEAN MODE);  
 
-- apple和banana之间是空格，空格表示OR，即至少包含apple、banana中的一个。
SELECT * FROM articles WHERE MATCH (title,body) AGAINST ('apple banana' IN BOOLEAN MODE); 
 
-- 必须包含apple，但是如果同时也包含banana则会获得更高的权重。
SELECT * FROM articles WHERE MATCH (title,body) AGAINST ('+apple banana' IN BOOLEAN MODE); 
 
-- ~ 是我们熟悉的异或运算符。返回的记录必须包含apple，但是如果同时也包含banana会降低权重。
-- 但是它没有 +apple -banana 严格，因为后者如果包含banana压根就不返回。
SELECT * FROM articles WHERE MATCH (title,body) AGAINST ('+apple ~banana' IN BOOLEAN MODE);
 
-- 返回同时包含apple和banana或者同时包含apple和orange的记录。
-- 但是同时包含apple和banana的记录的权重高于同时包含apple和orange的记录。
SELECT * FROM articles WHERE MATCH (title,body) AGAINST ('+apple +(>banana <orange)' IN BOOLEAN MODE);
```
### 索引的不足
- 过多的使用索引将会造成滥用。因此索引也会有它的缺点：虽然索引大大提高了查询速度，同时却会降低更新表的速度，如对表进行INSERT、UPDATE和DELETE。因为更新表时，MySQL不仅要保存数据，还要保存一下索引文件。建立索引会占用磁盘空间的索引文件。一般情况这个问题不太严重，但如果你在一个大表上创建了多种组合索引，索引文件的会膨胀很快。索引只是提高效率的一个因素，如果你的MySQL有大数据量的表，就需要花时间研究建立最优秀的索引，或优化查询语句。

### 索引的注意事项
- 索引不会包含有NULL值的列，只要列中包含有NULL值都将不会被包含在索引中，复合索引中只要有一列含有NULL值，那么这一列对于此复合索引就是无效的，所以我们在数据库设计时不要让字段的默认值为NULL；
- 使用短索引，对串列进行索引，如果可能应该指定一个前缀长度。例如，如果有一个CHAR(255)的列，如果在前10个或20个字符内，多数值是惟一的，那么就不要对整个列进行索引，短索引不仅可以提高查询速度而且可以节省磁盘空间和I/O操作；
- 索引列排序，MySQL查询只使用一个索引，因此如果WHERE子句中已经使用了索引的话，那么ORDER BY中的列是不会使用索引的。因此数据库默认排序可以符合要求的情况下不要使用排序操作；
- 尽量不要包含多个列的排序，如果需要最好给这些列创建复合索引；LIKE语句操作，一般情况下不鼓励使用LIKE操作，如果非使用不可，如何使用也是一个问题。LIKE '%aaa%' 不会使用索引而LIKE ‘aaa%'可以使用索引;
- 不要在列上进行运算，SELECT * FROM users WHERE YEAR(adddate)<2007，将在每个行上进行运算，这将导致索引失效而进行全表扫描，因此我们可以改成：SELECT * FROM users WHERE adddate<‘2007-01-01’；
- 不使用NOT IN和<>操作。

### 索引的方式
- 索引的方式BTree和Hash的区别比较高深，设计内容比较多，暂不考虑，一般使用BTree就行。

### 空间索引Spatial Index
- 一般在GIS上使用，数据类型也是用的比较特殊的GEOMETRY、POINT等，这里只讨论非空间索引，暂不讨论空间索引。


## 数据表的存储引擎
### 什么是存储引擎
- 关系数据库表是用于存储和组织信息的数据结构，可以将表理解为由行和列组成的表格，类似于Excel的电子表格的形式。有的表简单，有的表复杂，有的表根本不用来存储任何长期的数据，有的表读取时非常快，但是插入数据时去很差；而我们在实际开发过程中，就可能需要各种各样的表，不同的表，就意味着存储不同类型的数据，数据的处理上也会存在着差异，那么。对于MySQL来说，它提供了很多种类型的存储引擎，我们可以根据对数据处理的需求，选择不同的存储引擎，从而最大限度的利用MySQL强大的功能。这里将总结和分析各个引擎的特点，以及适用场合，并不会纠结于更深层次的东西。先学会用，懂得怎么用，再去知道到底是如何能用的。下面就对MySQL支持的存储引擎进行简单的介绍。
```SQL
SHOW ENGINES;-- 显示数据库支持那些存储引擎以及一些特性
```
- 下表是我的执行结果：
![image](http://note.youdao.com/yws/api/personal/file/WEB5d9078d8f7bf306b638caa3cd1cfec9b?method=download&shareKey=00c744da909965119b5c9f763fb6a3fe)
Engine是引擎名、Support是是否支持、Comment是描述、Transactions是是否支持普通事务、XA是是否支持XA事务、Savepoints是是否支持保存点。

### InnoDB
- InnoDB是一个健壮的事务型存储引擎，这种存储引擎已经被很多互联网公司使用，为用户操作非常大的数据存储提供了一个强大的解决方案。InnoDB作为默认的存储引擎。InnoDB还引入了行级锁定和外键约束，在以下场合下，使用InnoDB是最理想的选择：
    1. 更新密集的表。InnoDB存储引擎特别适合处理多重并发的更新请求。
    1. 事务。InnoDB存储引擎是支持事务的标准MySQL存储引擎。
    1. 自动灾难恢复。与其它存储引擎不同，InnoDB表能够自动从灾难中恢复。
    1. 外键约束。MySQL支持外键的存储引擎只有InnoDB。
    1. 支持自动增加列AUTO_INCREMENT属性。
    1. 一般来说，如果需要事务支持，并且有较高的并发读取频率，InnoDB是不错的选择。

### MyISAM
- MyISAM表是独立于操作系统的，这说明可以轻松地将其从Windows服务器移植到Linux服务器；每当我们建立一个MyISAM引擎的表时，就会在本地磁盘上建立三个文件，文件名就是表名。例如，我建立了一个MyISAM引擎的tb_Demo表，那么就会生成以下三个文件：
    1. tb_demo.frm，存储表定义；
    1. tb_demo.MYD，存储数据；
    1. tb_demo.MYI，存储索引。
- MyISAM表无法处理事务，这就意味着有事务处理需求的表，不能使用MyISAM存储引擎。MyISAM存储引擎特别适合在以下几种情况下使用：
    1. 选择密集型的表。MyISAM存储引擎在筛选大量数据时非常迅速，这是它最突出的优点。
    1. 插入密集型的表。MyISAM的并发插入特性允许同时选择和插入数据。例如：MyISAM存储引擎很适合管理邮件或Web服务器日志数据。

### MRG_MYISAM
- MERGE(等同于MRG_MYISAM)存储引擎是一组MyISAM表的组合，这些MyISAM表结构必须完全相同，尽管其使用不如其它引擎突出，但是在某些情况下非常有用。说白了，Merge表就是几个相同MyISAM表的聚合器；Merge表中并没有数据，对Merge类型的表可以进行查询、更新、删除操作，这些操作实际上是对内部的MyISAM表进行操作。Merge存储引擎的使用场景。
- 对于服务器日志这种信息，一般常用的存储策略是将数据分成很多表，每个名称与特定的时间端相关。例如：可以用12个相同的表来存储服务器日志数据，每个表用对应各个月份的名字来命名。当有必要基于所有12个日志表的数据来生成报表，这意味着需要编写并更新多表查询，以反映这些表中的信息。与其编写这些可能出现错误的查询，不如将这些表合并起来使用一条查询，之后再删除Merge表，而不影响原来的数据，删除Merge表只是删除Merge表的定义，对内部的表没有任何影响。
- 举例：
- 有如下t1、t2俩表：
```SQL
CREATE TABLE t1(
id INT(10) unsigned NOT NULL AUTO_INCREMENT, 
log VARCHAR(45), 
PRIMARY KEY(id)
)ENGINE = MyISAM;

CREATE TABLE t2(
id INT(10) unsigned NOT NULL AUTO_INCREMENT, 
log VARCHAR(45), 
PRIMARY KEY(id)
)ENGINE = MyISAM;
```
- 假设t1、t2中有如下记录：

id | log
---|---
1 | test1
2 | test2
3 | test3
- 建立MERGE表t：
```SQL
CREATE TABLE t(
id INT(10) unsigned NOT NULL AUTO_INCREMENT, 
log VARCHAR(45), 
PRIMARY KEY(id)
)ENGINE = MERGE UNION(t1, t2) INSERT_METHOD = LAST;
```
- 执行SELECT * FROM t;会得到如下结果：

id | log
---|---
1 | test1
2 | test2
3 | test3
1 | test1
2 | test2
3 | test3

#### 建表语句解释：
##### ENGINE=MERGE
指明使用MERGE引擎，ENGINE=MRG_MyISAM，也是对的，它们是一回事。
##### UNION=(t1, t2)
指明了MERGE表中挂接了些哪表，可以通过ALTER TABLE的方式修改UNION的值，以实现增删MERGE表子表的功能。
##### INSERT_METHOD=LAST
INSERT_METHOD指明插入方式，取值可以是：0 不允许插入；FIRST 插入到UNION中的第一个表； LAST 插入到UNION中的最后一个表。

MERGE表及构成MERGE数据表结构的各成员数据表必须具有完全一样的结构。每一个成员数据表的数据列必须按照同样的顺序定义同样的名字和类型，索引也必须按照同样的顺序和同样的方式定义。

#### 关于MERGE表的一些问题：
1、建表时UNION指明的子表如果存在相同主键的记录会怎么样？

相同主键的记录会同时存在于MERGE中，就像上面的例子所示。但如果继续向MERGE表中插入数据，若数据主键已存在则无法插入。换言之，MERGE表只对建表之后的操作负责。

2、若MREGE后存在重复主键，按主键查询会是什么结果？

顺序查询，只出现一条查询记录即停止。比如上面的例子，如果执行SELECT * FROM t WHERE id = 1;只会得到如下结果：
id | log
---|---
1 | test1
3、直接删除一个子表会出现什么情况，正确删除的方式是怎样的？

MERGE表会被破坏，正确方式是用ALTER TABLE方式先将子表从MERGE表中去除，再删除子表。以上面的例子为例，执行如下操作：
```SQL
ALTER TABLE t ENGINE = MRG_MyISAM UNION = (t1) INSERT_METHOD = LAST; 
```
4、误删子表时，如何恢复MERGE表？

误删子表时，MERGE表上将无法进行任何操作。

方法1，DROP MERGE表，重建。重建时注意在UNION部分去掉误删的子表。

方法2，建立MERGE表时，会在数据库目录下生成一个.MRG文件，比如设表名为t，则文件名为t.MRG。文件内容类似：
t1
t2
#INSERT_METHOD = LAST

指明了MGEGE表的子表构成及插入方式。可以直接修改此文件，去掉误删表的表名。然后执行flush tables即可修复MERGE表。

5、MERGE的子表中之前有记录，且有自增主键，则MERGE表创建后，向其插入记录时主键以什么规则自增？

以各表中的AUTO_INCREMENT最大值做为下一次插入记录的主键值。比如t1的自增ID至6，t2至4，则创建MERGE表后，插入的下一条记录ID将会是7

6、两个结构完全相同的但已存在数据的表，是否一定可以合成一个MEREGE表？

从实验的结果看，不是这样的，有时创建出的表，无法进行任何操作。
所以，推荐的使用方法是先有一个MERGE表，里面只包含一张表，当一个这个表的的大小增长到一定程度（比如200w）时，创建另一张空表，将其挂入MERGE表，然后继续插入记录。

7、删除MERGE表是否会对子表产生影响？

不会。

8、MREGE表的子表的ENGIN是否有要求？

有的，必须是MyISAM表。

### MEMORY
- 使用MySQL Memory存储引擎的出发点是速度。为得到最快的响应时间，采用的逻辑存储介质是系统内存。虽然在内存中存储表数据确实会提供很高的性能，但当mysqld守护进程崩溃时，所有的Memory数据都会丢失。获得速度的同时也带来了一些缺陷。它要求存储在Memory数据表里的数据使用的是长度不变的格式，这意味着不能使用BLOB和TEXT这样的长度可变的数据类型，VARCHAR是一种长度可变的类型，但因为它在MySQL内部当做长度固定不变的CHAR类型，所以可以使用。
- 一般在以下几种情况下使用Memory存储引擎：
    1. 目标数据较小，而且被非常频繁地访问。在内存中存放数据，所以会造成内存的使用，可以通过参数max_heap_table_size控制Memory表的大小，设置此参数，就可以限制Memory表的最大大小。
    1. 如果数据是临时的，而且要求必须立即可用，那么就可以存放在内存表中。
    1. 存储在Memory表中的数据如果突然丢失，不会对应用服务产生实质的负面影响。
- Memory同时支持散列索引和B树索引。B树索引的优于散列索引的是，可以使用部分查询和通配查询，也可以使用<、>和>=等操作符方便数据挖掘。散列索引进行“相等比较”非常快，但是对“范围比较”的速度就慢多了，因此散列索引值适合使用在=和<>的操作符中，不适合在<或>操作符中，也同样不适合用在ORDER BY子句中。

### BLACKHOLE
- MySQL在5.x系列提供了Blackhole引擎–“黑洞”.  其作用正如其名字一样：任何写入到此引擎的数据均会被丢弃掉， 不做实际存储；Select语句的内容永远是空。
- 和Linux中的 /dev/null 文件完成的作用完全一致。
- 那么， 一个不能存储数据的引擎有什么用呢？

    Blackhole虽然不存储数据，但是MySQL还是会正常的记录下Binlog，而且这些Binlog还会被正常的同步到Slave上，可以在Slave上对数据进行后续的处理。
    这样对于在Master上只需要Binlog而不需要数据的场合下，balckhole就有用了。
BlackHole 还可以用在以下场景:
    1. 验证dump file语法的正确性。
    1. 以使用blackhole引擎来检测binlog功能所需要的额外负载。
    1. 由于blackhole性能损耗极小，可以用来检测除了存储引擎这个功能点之外的其他MySQL功能点的性能。

### ARCHIVE
- Archive是归档的意思，在归档之后很多的高级功能就不再支持了，仅仅支持最基本的插入和查询两种功能。在MySQL 5.5版以前，Archive是不支持索引，但是在MySQL 5.5以后的版本中就开始支持索引了。Archive拥有很好的压缩机制，它使用zlib压缩库，在记录被请求时会实时压缩，所以它经常被用来当做仓库使用。
- 根据英文的测试结论来看，Archive表比MyISAM表要小大约75%，比支持事务处理的InnoDB表小大约83%。当数据量非常大的时候Archive的插入性能表现会较MyISAM为佳。
- Archive表的性能是否可能超过MyISAM？答案是肯定的。根据MySQL工程师的资料，当表内的数据达到1.5GB这个量级，CPU又比较快的时候，Archive表的执行性能就会超越MyISAM表。因为这个时候，CPU会取代I/O子系统成为性能瓶颈。别忘了Archive表比其他任何类型的表执行的物理I/O操作都要少。
- 较小的空间占用也能在你移植MySQL数据的时候发挥作用。当你需要把数据从一台MySQL服务器转移到另一台的时候，Archive表可以方便地移植到新的MySQL环境，你只需将保存Archive表的底层文件复制过去就可以了。

### CSV
- CSV引擎有点类似Oracle的外部表。它可以将“逗号分隔值（CSV）文件”作为表进行处理，但不支持在这种文件上建立相关索引。在服务器运行中，这种引擎支持从数据库中拷入/拷出CSV文件。如果从电子表格软件输出一个CSV文件，将其存放在MySQL服务器的数据目录中，服务器就能够马上读取相关的CSV文件。同样，如果写数据库到一个CSV表，外部程序也可以立刻读取它。在实现某种类型的日志记录时，CSV表作为一种数据交换格式，特别有用。
- 如果您想把EXCEL的数据或者CSV格式的数据导入到MySQL中，MySQL的CSV引擎再适合不过了。
MySQL的CSV引擎在5.0后开始提供，不过不支持WINDOWS，到了5.1才支持。
- 注意几点：
    1. 没有索引，跟MySQL5的数据字典库一样。
    1. 可以直接用任何文本编辑器来编辑数据文件。
    1. 非英文编码问题。
    1. 我的字符终端和表都是UTF-8的，所以要把上传的CSV文件保存为UTF-8的编码。
    1. 编码转化工具，我这边在WINDOWS下用EDITPLUS来转化，在LINUX下可以用ICONV命令行工具来转化编码。

### PERFORMANCE_SCHEMA
- MySQL 5.5开始新增一个数据库：PERFORMANCE_SCHEMA，主要用于收集数据库服务器性能参数。并且库里表的存储引擎均为PERFORMANCE_SCHEMA，而用户是不能创建存储引擎为PERFORMANCE_SCHEMA的表的。
### FEDERATED
- FEDERATED存储引擎是用于远程连接表的，默认是未启用的。开启FEDERATED存储引擎只需要在my.cnf文件中增加'federated'就可以。
- MySQL配置远程连接必须在本地创建FEDERATED存储引擎的表，配置远程连接参数，本地创建的表必须和远程表的定义保持一致，这里我就拿本地另一个案例数据库来做测试，效果和远程是一样。
```SQL
CREATE TABLE FEDERATED_actor (
   `actor_id` SMALLINT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
   `first_name` VARCHAR(45) NOT NULL,
   `last_name` VARCHAR(45) NOT NULL,
   `last_update` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (`actor_id`),
   KEY `idx_actor_last_name` (`last_name`)
 ) ENGINE =FEDERATED CONNECTION='mysql://root:123456@127.0.0.1:3306/sakila/actor';
```
- 注意：本地创建的表名必须在远程服务器存在，创建的字段也必须是远程表中的字段，可以比远程表的字段少，但是不能多，本地存储引擎选择：ENGINE = FEDERATED。

- CONNECTION选项中的连接字符串的一般形式如下：scheme://user_name[:password]@host_name[:port_num]/db_name/tbl_name

- 还有一些连接字符串的例子：

    CONNECTION='mysql://username:password@hostname:port/database/tablename'
    CONNECTION='mysql://username@hostname/database/tablename'
    CONNECTION='mysql://username:password@hostname/database/tablename'

- 注意：配置密码作为纯文本的话会存在安全问题，运行SHOW CREATE TABLE，SHOW TABLE STATUS是可以见的。
- 对本地进行更新操作，本地和远程的数据都被更改了。
- FEDERATED存储引擎不支持ALTER TABLE操作，DROP TABLE对远程表无影响。

## MySQL的可编程性
### 变量
#### 用户变量
- 以"@"开始，形式为"@变量名"用户变量跟MySQL客户端是绑定的，设置的变量，只对当前用户使用的客户端生效。不需要DECLARE。

#### 全局变量
- 全局变量在MySQL启动的时候由服务器自动将它们初始化为默认值，这些默认值可以通过更改my.ini这个文件来更改。定义时，以如下两种形式出现，SET GLOBAL 变量名 或者 SET @@GLOBAL.变量名 对所有客户端生效。只有具有super权限才可以设置全局变量。不需要DECLARE。
```SQL
SHOW GLOBAL VARIABLES;-- 显示所有全局变量
```
#### 会话变量
- 会话变量在每次建立一个新的连接的时候，由MySQL来初始化。MySQL会将当前所有全局变量的值复制一份。来做为会话变量。（也就是说，如果在建立会话以后，没有手动更改过会话变量与全局变量的值，那所有这些变量的值都是一样的。）全局变量与会话变量的区别就在于，对全局变量的修改会影响到整个服务器，但是对会话变量的修改，只会影响到当前的会话（也就是当前的数据库连接）。SET @@SESSION.变量名。LOCAL与SESSION是同义词。
```SQL
SHOW SESSION VARIABLES;-- 输出所有会话变量
```
#### 局部变量
- 作用范围在BEGIN到END语句块之间。在该语句块里设置的变量DECLARE语句专门用于定义局部变量。SET语句是设置不同类型的变量，包括会话变量和全局变量。
```SQL
DECLARE 变量名 datatype;-- 定义一个局部变量
DECLARE 变量名 datatype DEFAULT 默认值;-- 定义一个局部变量并赋值
```
#### 变量定义
- 会话变量与全局变量是系统自带的，不需要定义；用户变量用SET赋值就直接定义了，不需要DECLARE；只有局部变量才需要DECLARE。

#### 变量赋值
```SQL
SET 变量名 = 值;

SET 变量名 := 值;

SET 变量名 = 值, 变量名 = 值, ......;

SELECT 变量名 := 值;

SELECT 变量名 := columnname FROM tablename;

SELECT columnname1, columnname2, ... INTO 变量1, 变量2, ... FROM tablename ......;-- 需要结果唯一
```
### 条件判断
#### IF
- IF(Condition,A,B)，当Condition为TRUE时，返回A；当Condition为FALSE时，返回B。
```SQL
SELECT IF(100>50, -1, 1);-- 返回-1
```
- IFNULL(expr1, expr2)，假如expr1 不为 NULL，则 IFNULL() 的返回值为 expr1; 否则其返回值为expr2。IFNULL()的返回值是数字或是字符串，具体情况取决于其所使用的语境。
```SQL
SELECT IFNULL(-1, 1);-- 返回-1

SELECT IFNULL(NULL, 1);-- 返回1
```
- IF ELSE 作为流控制语句使用
```SQL
IF search_condition THEN 
    statement_list  
[
ELSEIF search_condition THEN 
    statement_list ...
]
[ELSE 
    statement_list
]  
END IF; 
```
#### CASE WHEN
```SQL
CASE    
WHEN Boolean_expression THEN result_expression
    [ ...n ]
    [ 
    ELSE else_result_expression
END

-- 例子1    
SELECT name,
CASE 
WHEN birthday < '1981' THEN 'old' 
WHEN birthday > '1988' THEN 'yong'
ELSE 'ok' END AS YORN
FROM lee;

-- 例子2
SELECT name, birthday,
CASE 
WHEN birthday > '1983' THEN 'yong'
WHEN name = 'lee' THEN 'handsome'
ELSE 'just so so' END
FROM lee;

CASE input_expression
WHEN when_expression THEN result_expression
    [ ...n ]
    [ 
    ELSE else_result_expression
END

-- 例子3
SELECT NAME, 
CASE name
WHEN 'sam' THEN 'yong'
WHEN 'lee' THEN 'handsome'
ELSE 'good' END as oldname
FROM lee;

SELECT CASE 1 WHEN 1 THEN 'one'
WHEN 2 THEN 'two' 
ELSE 'more' END
AS aliasname;-- 返回one
-- 若没有写ELSE且条件又匹配不到，则返回NULL
```
### 循环
#### WHILE
```SQL
-- 一般在函数或者存储过程中使用，下面是基本语法
WHILE 条件 DO
语句
END WHILE;
```
#### LOOP
```SQL
-- 例子
BEGIN
    DECLARE i INT DEFAULT 1; 
    loopname:LOOP #loopname是LOOP的名字
        IF(i<=5) THEN
            INSERT INTO a VALUES(i, CONCAT(i, 'test'));
            SET i=i+1;
            ITERATE loopname;#ITERATE是迭代的意思，类似于CONTINUE，此关键字非必须
        END IF;
        IF(i>5) THEN
            LEAVE loopname;#退出循环，类似于BREAK
        END IF;
    END LOOP;
END
```
- a表输出结果为：

id | content
---|---
1 | 1test
2 | 2test
3 | 3test
4 | 4test
5 | 5test

#### REPEAT
```SQL
-- 例子，先执行再判断i是否大于5，如果执行完大于5那么就结束循环
BEGIN
    DECLARE i INT DEFAULT 1;
    REPEAT
        INSERT INTO a VALUES(i, CONCAT(i, 'test'));
        SET i=i+1;
    UNTIL i>5 #UNTIL是必须有的关键字
    END REPEAT;
END
```
- a表输出结果为：

id | content
---|---
1 | 1test
2 | 2test
3 | 3test
4 | 4test
5 | 5test

#### SQL语句拼接执行
- 有时候我们会用到字符串去拼接一条特别长或者不得不利用字符串拼接才能生产的SQL语句，拼接的方式和在其他第三方代码里面的方式基本上是一个套路，拼接完之后执行我们会用到如下语句：
```SQL
-- @SQLE是我们在前面的代码中拼接好的SQL语句
PREPARE stmt FROM @SQLE;
EXECUTE stmt;
DEALLOCATE PREPARE stmt; 

-- 实例1
SET @SQLE = 'SELECT col1, col2 FROM table1 WHERE col3 IN(\'str1\', \'str2\')';
-- \' 子字符串中相当于 '。因为单引号是特殊字符所以要用反斜杠转义
PREPARE stmt FROM @SQLE;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 实例2
SET @SQLE = CONCAT('SELECT col1, col2 FROM table1 WHERE col3 = \'' , @a , '\'');
-- 其中@a是一个字符串变量，MySQL中字符串不能用“+”拼接，只能用CONCAT函数，上面这句话相当于：
-- 'SELECT col1, col2 FROM table1 WHERE col3 = \'' + @a +'\''
PREPARE stmt FROM @SQLE;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 实例3
PREPARE stmt1 FROM 'SELECT SQRT(POW(?,2) + POW(?,2)) AS test';
SET @a = 3;
SET @b = 4;
EXECUTE stmt1 USING @a, @b;
DEALLOCATE PREPARE stmt1;

--实例4
SET @a = 'SELECT * FROM a WHERE id>1 LIMIT ?,?';
PREPARE stmt1 FROM @a;
SET @b = 0;
SET @c = 3;
EXECUTE stmt1 USING @b,@c;
DEALLOCATE stmt1;
-- 注意这个例子中LIMIT后面可以用以上的“？”来作为变量。
-- 但是在非字符串拼接的SQL中LIMIT不能使用变量，比如：SELECT * FROM table LIMIT @a,@b 就是错误的。
```

## 触发器（TRIGGER）
- MySQL包含对触发器的支持。触发器是一种与表操作有关的数据库对象，当触发器所在表上出现指定事件时，将调用该对象，即表的操作事件触发表上的触发器的执行。
```SQL
CREATE TRIGGER triggername AFTER UPDATE ON tablename FOR EACH ROW 
triggerstatement;-- 基本语法，triggerstatement是一句SQL
```
- AFTER：是先完成数据的增删改，然后再触发，触发的语句晚于监视的增删改，无法影响前面的增删改动作；
- BEFORE：先完成触发，在进行增删改，触发语句先于监视的增删改，我们就有机会判断，修改即将发生的操作。
- INSERT 型触发器：插入某一行时激活触发器，可能通过 INSERT、LOAD DATA、REPLACE 语句触发；
- UPDATE 型触发器：更改某一行时激活触发器，可能通过 UPDATE 语句触发；
- DELETE 型触发器：删除某一行时激活触发器，可能通过 DELETE、REPLACE 语句触发。
- 一张表可以建6个种触发器：BEFORE INSERT、BEFORE UPDATE、BEFORE DELETE、AFTER INSERT、AFTER UPDATE、AFTER DELETE，每种触发器最多只能建一个，也就是说一张表最多可以建6个触发器。
```SQL
DELIMITER new_delemiter
CREATE TRIGGER triggername AFTER UPDATE ON tablename FOR EACH ROW 
BEGIN
[statement_list]
END new_delemiter
DELIMITER ;-- 基本语法，triggerstatement是一段SQL语句
```
- 其中，statement_list 代表一个或多个语句的列表，列表内的每条语句都必须用分号（;）来结尾。
- 而在MySQL中，分号是语句结束的标识符，遇到分号表示该段语句已经结束，MySQL可以开始执行了。因此，解释器遇到statement_list 中的分号后就开始执行，然后会报出错误，因为没有找到和 BEGIN 匹配的 END。
- 这时就会用到 DELIMITER 命令（DELIMITER 是定界符，分隔符的意思），它是一条命令，不需要语句结束标识，语法为：
DELIMITER new_delemiter
- new_delemiter 可以设为1个或多个长度的符号，默认的是分号（;），我们可以把它修改为其他符号，如$：
DELIMITER $
在这之后的语句，以分号结束，解释器不会有什么反应，只有遇到了$，才认为是语句结束。注意，使用完之后，我们还应该记得把它给修改回来。
```SQL
DELIMITER $
CREATE TRIGGER triggername AFTER INSERT 
ON tablename FOR EACH ROW 
BEGIN
DECLARE c INT;
SET c = (SELECT stuCount FROM class WHERE classID = new.classID);
UPDATE class SET stuCount = c + 1 WHERE classID = new.classID;
END $
DELIMITER ;-- 例子
```
- NEW与OLD表示触发器的所在表中，触发了触发器的那一行数据。
- 在 INSERT 型触发器中，NEW 用来表示将要（BEFORE）或已经（AFTER）插入的新数据；
- 在 UPDATE 型触发器中，OLD 用来表示将要或已经被修改的原数据，NEW 用来表示将要或已经修改为的新数据；
- 在 DELETE 型触发器中，OLD 用来表示将要或已经被删除的原数据；
- 使用方法： NEW.columnName （columnName 为相应数据表某一列名）
- 另外，OLD 是只读的，而 NEW 则可以在触发器中使用 SET赋值，这样不会再次触发触发器，造成循环调用。

```SQL
DROP TRIGGER IF EXISTS triggername;-- 删除触发器
DROP TRIGGER triggername;
```
- 触发器的执行顺序:我们建立的数据库一般都是 InnoDB 数据库，其上建立的表是事务性表，也就是事务安全的。这时，若SQL语句或触发器执行失败，MySQL 会回滚事务，有：①如果 BEFORE 触发器执行失败，SQL 无法正确执行。②SQL 执行失败时，AFTER 型触发器不会触发。③AFTER 类型的触发器执行失败，SQL 会回滚。

## 游标（CURSOR）
- 简单的说：游标（CURSOR）就是游动的标识，通俗的说，一条SQL取出对应n条结果资源的接口/句柄，就是游标，沿着游标可以一次取出一行。
- 假设我们写一条SELECT语句，理论上会给我们返回一个结果集，一般来说呢，我们可以一次把这个结果集取走，但是有时候呢我不想一次把所有内容都取走，我们就想一条一条的取，这时我们就要用到游标了。
- 游标一般用在存储过程里面。
```SQL
DECLARE cursorname CURSOR FOR select_statement;-- 定义一个游标

DECLARE CONTINUE HANDLER FOR NOT FOUND SET columnname = value;
-- 当游标移动到最后的时候给某一字段赋某个值，CONTINUE还可以是EXIT
-- CONTINUE意味着在SET执行完之后还要执行FETCH后面的语句
-- EXIT意味着如果游标走到了最后了便不会再执行FETCH之后的语句了

OPEN cursorname;-- 打开游标

FETCH cursorname INTO val1, val2 ……;-- 取值

CLOSE cursorname;-- 关闭游标，游标用完之后必须关闭
```
```SQL
/*游标用法举例*/
BEGIN
 DECLARE no_more_record INT DEFAULT 0;
 DECLARE pID BIGINT(20);
 DECLARE pValue DECIMAL(15,5);
 DECLARE cur_record CURSOR FOR SELECT colA, colB FROM tableABC;  
 /*首先这里对游标进行定义*/
 DECLARE CONTINUE HANDLER FOR NOT FOUND SET no_more_record = 1; 
 /*这个是个条件处理,针对NOT FOUND的条件,当没有记录时赋值为1*/

 OPEN cur_record; /*接着使用OPEN打开游标*/
 FETCH cur_record INTO pID, pValue; /*把第一行数据写入变量中,游标也随之指向了记录的第一行*/

 WHILE no_more_record != 1 DO
 INSERT INTO testTable(ID, Value) VALUES(pID, pValue);
 FETCH cur_record INTO pID, pValue;
 END WHILE;
 CLOSE cur_record; /*用完后记得用CLOSE把资源释放掉*/
END
```
## 系统函数
### 数学函数
函数 | 作用
---|---
ABS(x) | 返回x的绝对值
CEIL(x), CEILING(x) | 返回大于或等于x的最小整数(向上取整)
FLOOR(x) | 返回小于或等于x的最大整数（向下取整）
RAND() | 返回0~1的随机数
RAND(x) | 返回0~1的随机数，x值相同时返回的随机数相同
SIGN(x) | 返回x的符号，x是负数、0、正数分别返回-1、0、1
PI() | 返回圆周率
TRUNCATE(x,y) | 返回数值x保留到小数点后y位的值
ROUND(x) | 返回离x最近的整数（四舍五入）
ROUND(x,y) | 保留x小数点后y位的值，但截断时要四舍五入
POW(x,y),POWER(x,y) | 返回x的y次方
SQRT(x) | 返回x的平方根
EXP(x) | 返回e的x次方
MOD(x,y) | 返回x除以y以后的余数
LN(x),LOG(x) | 返回自然对数（以e为底的对数）
LOG(x,y) | 返回x的以y为底的对数
LOG10(x) | 返回以10为底的对数
RADIANS(x) | 将角度转化为弧度
DEGREES(x) | 将弧度转化为角度
SIN(x) | 求正弦值
COS(x) | 求余弦值
ASIN(x) | 求反正弦值
ACOS(x) | 求反余弦值
TAN(x) | 求正切值
ATAN(x),ATAN(x,y) | 求反正切值
COT(x) | 求余切值
GREATEST(x1,x2,...,xn) | 返回集合中最大的值
LEAST(x1,x2,...,xn) | 返回集合中最小的值
BIN(x) | 返回x的二进制
OCT(x) | 返回x的二进制
HEX(x) | 返回x的二进制

### 字符串函数
函数 | 作用
---|---
CHAR_LENGTH(s) | 返回字符串s的字符数
LENGTH(s) | 返回字符串s的长度
CONCAT(s1,s2,.....) | 将字符串s1,s2等多个字符串合并为一个字符串
CONCAT_WS(x,s1,s2,....) | 同COUCAT(s1,s2,.....)，但是每个字符串之间要加上x
INSERT(s1,x,len,s2) | 将s1的x位置开始长度为len的字符串替换为字符串s2
UPPER(s),UCASE(s) | 将字符串s的所有字符都变成大写字母
LOWER(s),LCASE(s) | 将字符串s的所有字符都变成小写字母
QUOTE(s) | 用反斜杠转义s中的单引号
LENGTH(s) | 返回字符串s中的字符数
LEFT(s,n) | 返回字符串s的前n个字符
RIGHT(s,n) | 返回字符串s的后n个字符
LPAD(s1,len,s2) | 用字符串s2来填充s1，从左填充，使字符串长度达到len，若len小于s1的长度，则将s1从左截取为长度为len的字符串
RPAD(s1,len,s2) | 用字符串s2来填充s1，从右填充，使字符串长度达到len，若len小于s1的长度，则将s1从左截取为长度为len的字符串
LTRIM(s) | 去掉字符串s开始处的空格
RTRIM(s) | 去掉字符串s结尾处的空格
TRIM(s) | 去掉字符串s开始处和结尾处的空格
TRIM(s1 FROM s) | 去掉字符串s中开始处和结尾处的字符串s1
REPEAT(s,n) | 将字符串s重复n次
SPACE(n) | 返回n个空格
REPLACE(s,s1,s2) | 用字符串s2代替字符串s中的字符串s1
STRCMP(s1,s2) | 比较s1与s2，s1的排序如果在s2的前面则返回-1，s1的排序如果在s2的后面则返回1，排序一样返回0
SUBSTRING(s,n,len),MID(s,n,len) | 获取从字符串s中的第n个位置开始长度为len的字符串
POSTTION(s1 IN s) | 从字符串s中获取s1的开始位置
INSTR(s,s1) | 从字符串s中获取s1的开始位置
REVERSE(s) | 将字符串s的顺序反过来
ELT(n,s1,s2...) | 返回第n个字符串
FIELD(s,s1,s2...) | 返回第一个与字符串s匹配的字符串的位置,若没有匹配返回0
FIND_IN_SET(s,col) | 返回某个字段中，包含s的的记录,一般用在WHERE后面
MAKE_SET(x,s1,s2...) | 按x的二进制数从s1,s2......sn中选取字符串

### 日期和时间函数
函数 | 作用
--- | ---
CURDATE(),CURRENT_DATE() | 返回当前日期
CURTIME(),CURRENT_TIME() | 返回当前时间
NOW(),CURRENT_TIMESTAMP(),LOCALTIME(),SYSDATE(),LOCALTIMESTAMP() | 返回当前的日期和时间
UNIX_TIMESTAMP() | 以UNIX形式返回当前时间戳，是自 1970 年 1 月 1 日（00:00:00 GMT）以来的秒数。它也被称为 Unix 时间戳（Unix Timestamp）。
UNIX_TIMESTAMP(d) | 以UNIX形式返回时间d的时间戳
FROM_UNIXTIME(d) | 把UNIX时间戳的时间转换为普通格式的时间
UTC_DATE() | 返回UTC(国际协调时间)日期
UTC_TIME() | 返回UTC时间
MONTH(d) | 返回日期d中的月份值，范围是1~12
MONTHNAME(d) | 返回日期d中的月份名称，如January
DAYNAME(d) | 返回日期d是星期几，如Monday
DAYOFWEEK(d) | 返回日期d是星期几，1表示星期日，2表示星期2
WEEKDAY(d) | 返回日期d是星期几，0表示星期一,1表示星期2
WEEK(d) | 计算日期d是本年的第几个星期，范围是0-53
WEEKOFYEAR(d) | 计算日期d是本年的第几个星期，范围是1-53
DAYOFYEAR(d) | 计算日期d是本年的第几天
DAYOFMONTH(d) | 计算日期d是本月的第几天
YEAR(d) | 返回日期d中的年份值
QUARTER(d) | 返回日期d是第几季度，范围1-4
DAY(t) | 返回日期t中的日期值
HOUR(t) | 返回时间t中的小时值
MINUTE(t) | 返回时间t中的分钟值
SECOND(t) | 返回时间t中的秒钟值
EXTRACT(type FROM d) | 从日期d中获取指定的值，type指定返回的值，如YEAR,HOUR等
TIME_TO_SEC(t) | 将时间t转换为秒(当天00：00：00开始计时)
SEC_TO_TIME(s) | 将以秒为单位的时间s转换为时分秒的格式
TO_DAYS(d) | 计算日期d到0000年1月1日的天数
FROM_DAYS(n) | 计算从0000年1月1日开始n天后的日期
DATEDIFF(d1,d2) | 计算日期d1到d2之间相隔的天数
ADDDATE(d,n) | 计算开始日期d加上n天的日期
ADDDATE(d, INTERVAL expr type) | 计算起始日期d加上一个时间段后的日期
SUBDATE(d,n) | 计算起始日期d减去n天的日期
SUBDATE(d, INTERVAL  expr type) | 计算起始日期d减去一个时间段后的日期
ADDTIME(t,n) | 计算起始时间t加上n秒的时间
SUBTIME(t,n) | 计算起始时间t减去n秒的时间
DATE_FORMAT(d,f) | 按照表达式f的要求显示日期d
TIME_FORMAT(t,f) | 按照表达式f的要求显示时间t
GET_FORMAT(type,s) | 根据字符串s获取type类型数据的显示格式,例如：SELECT DATE_FORMAT('2017-1-9',GET_FORMAT(DATE, 'EUR'))
PERIOD_DIFF(d1,d2) | 返回d1和d2两个日期的月份差

### 条件判断函数
- 详见 可编程性 条件判断 章节

### 系统信息函数
函数 | 作用
--- | ---
VERSION() | 返回数据库的版本号
CONNECTION_ID() | 返回当前客户的连接ID
DATABASE(),SCHEMA() | 返回当前数据库名
USER(),SYSTEM_USER() | 返回当前用户的名称
CHARSET(str) | 返回字符串str的字符集
COLLATION(str) | 返回字符串str的字符排列方式
LAST_INSERT_ID() | 返回最后生成的auto_increment值
FOUND_ROWS() | 返回最后一个SELECT查询进行检索的总行数
BENCHMARK(n,expr) | 将表达式expr重复运行n次,总是返回0，主要是为了测试某个表达式执行n次的时间时间

### 加密函数
函数 | 作用
--- | ---
PASSWORD(str) | 返回字符串str的加密版本，这个加密过程是不可逆转的，和UNIX密码加密过程使用不同的算法。
MD5(str) | 计算字符串str的MD5校验和
SHA(str) | 计算字符串str的安全散列算法(SHA)校验和
ENCRYPT(str,salt) | 使用UNIXcrypt()函数，用关键词salt(一个可以惟一确定口令的字符串，就像钥匙一样)加密字符串str
ENCODE(str,key) | 使用key作为密钥加密字符串str，调用ENCODE()的结果是一个二进制字符串，它以BLOB类型存储
DECODE(str,key) | 使用key作为密钥解密加密字符串str
AES_ENCRYPT(str,key) | 返回用密钥key对字符串str利用高级加密标准算法加密后的结果，调用AES_ENCRYPT的结果是一个二进制字符串，以BLOB类型存储
AES_DECRYPT(str,key) | 返回用密钥key对字符串str利用高级加密标准算法解密后的结果
### 锁函数
函数 | 作用
--- | ---
GET_LOCT(name,time) | 加锁函数，定义一个名称为name、持续时间长度为time秒的锁，如果锁定成功，返回1，如果尝试超时，返回0，如果遇到错误，返回NULL
RELEASE_LOCK(name) | 解除名称为name的锁，如果解锁成功，返回1，如果尝试超时，返回0，如果解锁失败，返回NULL
IS_FREE_LOCK(name) | 判断是否使用名为name的锁，如果使用，返回0，否则返回1.

### 格式化函数
函数 | 作用
--- | ---
FORMAT(x,n) | 格式化函数，可以将数字x进行格式化，将x保留到小数点后n位，这个过程需要进行四舍五入。
ASCII(s) | 返回字符串s的第一个字符的ASSCII码
CONV(x,f1,f2) | 将x从f1进制数变成f2进制数
INET_ATON(IP) | 将IP地址转换为数字表示，IP值需要加上引号
INET_NTOA(n) | 可以将数字n转换成IP的形式
CONVERT(s USING cs) | 将字符串s的字符集变成cs
CAST(x AS type),CONVERT(x,type) | 这两个函数将x变成type类型，这两个函数只对BINARY,CHAR,DATE,DATETIME,TIME,SIGNED  INTEGER,UNSIGNED INTEGER这些类型起作用，但这两种方法只是改变了输出值得数据类型，并没有改变表中字段的类型。

## 自定义函数（FUNCTION）
- 上面讲了MySQL里面的内置函数，这些内置函数给我们提供了很大的便利，可是我们总会遇到一些特殊的需求，需要调用函数，按照我们自己的逻辑来实现一些功能，解决一些问题。MySQL的自定义函数就是为了解决这个问题而存在的。
### 函数的定义
```SQL
-- 定义了一个名为hello的，不带任何参数，返回值为VARCHAR(255)类型的一个函数
DELIMITER $$
DROP FUNCTION IF EXISTS hello $$
CREATE FUNCTION hello()
RETURNS VARCHAR(255)
BEGIN
    RETURN 'Hello World,I am MySQL';
END $$
DELIMITER ;

-- 定义了一个名为hello的，带两个参数的，返回值为VARCHAR(255)类型的一个函数
DELIMITER $$
DROP FUNCTION IF EXISTS hello $$
CREATE FUNCTION hello(para1 VARCHAR(255), para2 VARCHAR(100))
RETURNS VARCHAR(255)
BEGIN
    RETURN para1 + para2;
END $$
DELIMITER ;

SHOW FUNCTION STATUS LIKE 'hello';#查看定义的函数
SHOW CREATE FUNCTION hello;#查看定义的函数
```
### 函数的调用
```SQL
SELECT hello();-- 无参数的函数调用
SELECT hello('Hello World,','I am MySQL');-- 有参数的函数调用
```
### 函数的修改
```SQL
ALTER FUNCTION func_name [characteristic ...]
characteristic:
    COMMENT 'string'
  | LANGUAGE SQL
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
 
 /*上面这个语法结构是MySQL官方给出的，修改的内容可以包含SQL语句也可以不包含，
 既可以是读数据的SQL也可以是修改数据的SQL还有权限。此外在修改function的时候
 还需要注意你不能使用这个语句来修改函数的参数以及函数体，如果你想改变这些的
 话你就需要删除掉这个函数然后重新创建。*/
 
-- 例子
ALTER FUNCTION hello
READS SQL DATA
SQL SECURITY INVOKER
COMMENT 'print  hello';
```
### 函数的删除
```SQL
DROP FUNCTION function_name;

DROP FUNCTION hello;
```

## 存储过程（STORED PROCEDURE）
- SQL语句需要先编译然后执行，而存储过程（Stored Procedure）是一组为了完成特定功能的SQL语句集，经编译后存储在数据库中，用户通过指定存储过程的名字并给定参数（如果该存储过程带有参数）来调用执行它。

- 存储过程是可编程的函数，在数据库中创建并保存，可以由SQL语句和控制结构组成。当想要在不同的应用程序或平台上执行相同的函数，或者封装特定功能时，存储过程是非常有用的。数据库中的存储过程可以看做是对编程中面向对象方法的模拟，它允许控制数据的访问方式。

- 存储过程的优点：

1. 增强SQL语言的功能和灵活性：存储过程可以用控制语句编写，有很强的灵活性，可以完成复杂的判断和较复杂的运算。

1. 标准组件式编程：存储过程被创建后，可以在程序中被多次调用，而不必重新编写该存储过程的SQL语句。而且数据库专业人员可以随时对存储过程进行修改，对应用程序源代码毫无影响。

1. 较快的执行速度：如果某一操作包含大量的Transaction-SQL代码或分别被多次执行，那么存储过程要比批处理的执行速度快很多。因为存储过程是预编译的。在首次运行一个存储过程时查询，优化器对其进行分析优化，并且给出最终被存储在系统表中的执行计划。而批处理的Transaction-SQL语句在每次运行时都要进行编译和优化，速度相对要慢一些。

1. 减少网络流量：针对同一个数据库对象的操作（如查询、修改），如果这一操作所涉及的Transaction-SQL语句被组织进存储过程，那么当在客户计算机上调用该存储过程时，网络中传送的只是该调用语句，从而大大减少网络流量并降低了网络负载。

1. 作为一种安全机制来充分利用：通过对执行某一存储过程的权限进行限制，能够实现对相应的数据的访问权限的限制，避免了非授权用户对数据的访问，保证了数据的安全。

- 存储过程是数据库的一个重要的功能，MySQL 5.0以前并不支持存储过程，这使得MySQL在应用上大打折扣。好在MySQL 5.0开始支持存储过程，这样即可以大大提高数据库的处理速度，同时也可以提高数据库编程的灵活性

### 存储过程的创建
```SQL
#参数的类型有三种IN、OUT、INOUT
DELIMITER //
  CREATE PROCEDURE myproc(OUT s INT) #参数个数和类型可以有很多个，也可以没有参数
    BEGIN
      SELECT COUNT(*) INTO s FROM students;#可以写任意SQL语句
    END
    //
DELIMITER ;
```
#### 参数
- 存储过程根据需要可能会有输入、输出、输入输出参数，如果有多个参数用","分割开。MySQL存储过程的参数用在存储过程的定义，共有三种参数类型,IN,OUT,INOUT:
- IN参数的值必须在调用存储过程时指定，在存储过程中修改该参数的值不能被返回，为默认值
- OUT:该值可在存储过程内部被改变，并可返回
- INOUT:调用时指定，并且可被改变和返回
```SQL
#例子
-- 首先创建存储过程
DELIMITER $$
CREATE PROCEDURE para_test(IN a INT, OUT b INT, INOUT c INT)
BEGIN
 SELECT a, b, c;#对应输出结果1
 SET a = 97, b = 98, c = 99; 
 SELECT a, b, c;#对应输出结果2
END;
$$
DELIMITER ;

-- 调用存储过程
SET @a = 1, @b = 2, @c = 3;
CALL para_test(@a, @b, @c);
SELECT @a, @b, @c;#对应输出结果3
```
- 输出结果：

a | b | c 
---|---|---
1 | [Null] | 3

a | b | c 
---|---|---
97| 98 | 99

@a | @b | @c 
---|---|---
1 | 98 | 99

- 由此可看出，IN变量是可以被输入的，但是在存储过程被调用的时候无论做了什么操作，它再次被输出的时候还是原来的值，不会改变；OUT变量是不能被输入的，输入什么值都是[Null]，但是在存储过程内部被调用和运算之后得到的值可以被输出；INOUT变量即可以被输入，在存储过程内部被调用之后得到的值也可以被输出。 

### 存储过程的调用
```SQL
CALL procedure_name();-- 无参数存储过程调用
CALL procedure_name(para1, para2, ......);-- 带参数存储过程调用
```
###  存储过程相关查询
```SQL
SELECT name FROM mysql.proc WHERE db='dbname';-- 查询某个数据库所有存储过程的名字

SELECT * FROM mysql.proc;-- 查询所有存储过程的信息

SELECT routine_name FROM information_schema.routines WHERE routine_schema='dbname';
-- 查询某个数据库所有存储过程的名字

SHOW PROCEDURE STATUS WHERE db='dbname';

SHOW CREATE PROCEDURE dbname.procname;-- 查看存储过程的详细信息，比如定义语句之类的
```
### 存储过程的修改
```SQL
-- 与自定义函数修改的语法一样，参数的用法也一样
ALTER {PROCEDURE | FUNCTION} sp_name [characteristic ...]
characteristic:
{ CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
| SQL SECURITY { DEFINER | INVOKER }
| COMMENT 'string'
```
- sp_name参数表示存储过程或函数的名称；
- characteristic参数指定存储函数的特性。
- CONTAINS SQL表示子程序包含SQL语句，但不包含读或写数据的语句；
- NO SQL表示子程序中不包含SQL语句；
- READS SQL DATA表示子程序中包含读数据的语句；
- MODIFIES SQL DATA表示子程序中包含写数据的语句。
- SQL SECURITY { DEFINER | INVOKER }指明谁有权限来执行，DEFINER表示只有定义者自己才能够执行；INVOKER表示调用者可以执行。
- COMMENT 'string'是注释信息。
 
```SQL
#实例
-- 将读写权限改为MODIFIES SQL DATA，并指明调用者可以执行。
ALTER PROCEDURE proc_name
MODIFIES SQL DATA
SQL SECURITY INVOKER ;

-- 将读写权限改为READS SQL DATA，并加上注释信息'example'。
ALTER  PROCEDURE proc_name
READS SQL DATA
COMMENT 'example' ;
```
### 存储过程的删除
```SQL
DROP PROCEDURE proc1;-- 删除一个存储过程

DROP PROCEDURE proc1, proc2, ......;-- 删除多个存储过程
```
### 存储过程的定义条件和预处理
- 以后学习完再写

## 事务（TRANSACTION）
- MySQL事务主要用于处理操作量大，复杂度高的的数据。比如说，在人员管理系统中，你删除一个人员，你即需要删除人员的基本资料，也要删除和该人员相关的信息，如信箱，文章等等，这样，这些数据库操作语句就构成一个事务！
- 在MySQL中只有InnoDB数据引擎的数据库才支持事务。
- 事务处理可以用来维护数据库的完整性，保证成批的 SQL 语句要么全部执行，要么全部不执行。
- 事务用来管理 INSERT,UPDATE,DELETE 语句。
- 一般来说，事务是必须满足4个条件（ACID）：Atomicity（原子性）、Consistency（稳定性）、Isolation（隔离性）、Durability（可靠性）
1. 事务的原子性：一组事务，要么成功；要么撤回。
1. 稳定性 ：有非法数据（外键约束之类），事务撤回。
1. 隔离性：事务独立运行。一个事务处理后的结果，影响了其他事务，那么其他事务会撤回。事务的100%隔离，需要牺牲速度。
1. 可靠性：软、硬件崩溃后，InnoDB数据表驱动会利用日志文件重构修改。可靠性和高速度不可兼得， innodb_flush_log_at_trx_commit 选项 决定什么时候吧事务保存到日志里。

==在 MySQL 命令行的默认设置下，事务都是自动提交的AUTOCOMMIT = 1，即执行 SQL 语句后就会马上执行 COMMIT 操作,即每条语句都会封装上 START TRANSACTION 和 COMMIT。因此要显式地开启一个事务务须使用命令 BEGIN 或 START TRANSACTION，或者执行命令 SET AUTOCOMMIT = 0，用来禁止使用当前会话的自动提交。==
```SQL
SHOW GLOBAL VARIABLES LIKE 'autocommit';-- 可以查询自动提交的状态

SET AUTOCOMMIT = 0;-- 设置禁止使用当前会话的自动提交
```

- 事物控制语句：
1. BEGIN或START TRANSACTION；显式地开启一个事务；
1. COMMIT；也可以使用COMMIT WORK，不过二者是等价的。COMMIT会提交事务，并使已对数据库进行的所有修改称为永久性的；
1. ROLLBACK；有可以使用ROLLBACK WORK，不过二者是等价的。回滚会结束用户的事务，并撤销正在进行的所有未提交的修改；
1. SAVEPOINT identifier；SAVEPOINT允许在事务中创建一个保存点，一个事务中可以有多个SAVEPOINT；
1. RELEASE SAVEPOINT identifier；删除一个事务的保存点，当没有指定的保存点时，执行该语句会抛出一个异常；
1. ROLLBACK TO identifier；把事务回滚到标记点；
1. SET TRANSACTION；用来设置事务的隔离级别。InnoDB存储引擎提供事务的隔离级别有READ UNCOMMITTED、READ COMMITTED、REPEATABLE READ和SERIALIZABLE。
```SQL
#显式开启事务
START TRANSACTION;-- 或BEGIN;
INSERT INTO tablename VALUES('xx1', 'xx2', 'xx3');-- INSERT,UPDATE,DELETE语句
ROLLBACK;-- 或COMMIT;
```
```PHP
应用场景举例
/*
事务一般用在第三方程序操作数据库，比如用PHP代码对数据库进行操作
PHP在执行某个SQL语句之后一定会返回成功或者失败的结果
当我们的程序拿到结果之后就可以判断是该执行COMMIT还是该执行ROLLBACK等

START TRANSACTION;或者SET AUTOCOMMIT = 0; 先执行这句开启事务
SQL1;执行第一条SQL语句，如果成功就执行第二条，失败就执行ROLLBACK
SQL2;执行第二条SQL语句，如果成功就执行COMMIT，失败就执行ROLLBACK
代码举例如下
*/
<?php
include_once("conn.php");

$id=$_GET[id];
$conn->autocommit(false);
if(!$conn->query("delete from tb_sco where id='".$id."'"))
{
  $conn->rollback();
}
if(!$conn->query("delete from tb_stu where id='".$id."'"))
{
  $conn->rollback();
}
  $conn->commit();
  $conn->autocommit(true);
  echo "ok"
?>
```
```SQL
#SAVEPOINT用法举例

SELECT id,name FROM trans_test;-- 原始表

/*
+----+------+  
| id | name |  
+----+------+  
| 1 | a |  
| 2 | b |  
+----+------+
*/
  
START TRANSACTION;-- 开启事务

UPDATE trans_test SET name=’z’ WHERE id = 1;-- 更新表
  
SAVEPOINT savepoint_one;--设置保存点1  
  
UPDATE trans_test SET name=’y’ WHERE id = 2;-- 再次更新表 

SELECT id,name FROM trans_test;-- 查询更新两次后的表的结果

/*
+----+------+  
| id | name |  
+----+------+  
| 1 | z |  
| 2 | y |  
+----+------+  
*/

ROLLBACK TO SAVEPOINT savepoint_one;-- 回滚到保存点1

SELECT id,name FROM trans_test;-- 查询最终结果回滚到了保存点1的状态

/*
+----+------+  
| id | name |  
+----+------+  
| 1 | z |  
| 2 | b |  
+----+------+ 
*/
COMMIT;-- 提交 
```

## 事件（EVENT）
- 事件（EVENT）是MySQL在相应的时刻调用的过程式数据库对象。一个事件可调用一次，也可周期性的启动，它由一个特定的线程来管理的，也就是所谓的“事件调度器”。
- 事件和触发器类似，都是在某些事情发生的时候启动。当数据库上启动一条语句的时候，触发器就启动了，而事件是根据调度事件来启动的。由于他们彼此相似，所以事件也称为临时性触发器。
- 事件取代了原先只能由操作系统的计划任务来执行的工作，而且mysql的事件调度器可以精确到每秒钟执行一个任务，而操作系统的计划任务（如：Linux下的CRON或Windows下的任务计划）只能精确到每分钟执行一次。
- 一些对数据定时性操作不再依赖外部程序，而直接使用数据库本身提供的功能。可以实现每秒钟执行一个任务，这在一些对实时性要求较高的环境下就非常实用了。

### 事件的开启
```SQL
SHOW VARIABLES LIKE 'event_scheduler';-- 查看事件是否开启

SET GLOBAL EVENT_SCHEULER = ON; -- 开启事件，只有开启事件之后事件才会生效
```

### 事件的创建
```SQL
-- 创建事件
CREATE 
[DEFINER = {user | CURRENT_USER}]
EVENT
[IF NOT EXISTS]
event_name
ON SCHEDULE schedule
[ON COMPLETION [NOT] PRESERVE]
[ENABLE | DISABLE | DISABLE ON SLAVE]
[COMMENT 'comment']
DO event_body;

-- event_name即事件的名称

-- [ON COMPLETION [NOT] PRESERVE]：可选项，默认是ON COMPLETION NOT PRESERVE
-- 即计划任务执行完毕后自动DROP该事件（事件会被直接删除）；ON COMPLETION PRESERVE则不会DROP掉。

-- [COMMENT 'comment'] ：可选项，comment 用来描述event；相当注释，最大长度64个字节。

-- [ENABLE | DISABLE] ：设定event的状态，默认ENABLE：表示系统尝试执行这个事件，
-- DISABLE：关闭该事情，可以用alter修改

-- DO event_body: 需要执行的sql语句（可以是复合语句）。CREATE EVENT在存储过程中使用是合法的。

/* schedule 有两种形式
AT timestamp [+ INTERVAL interval] （在某个时刻执行该事件，不能是个过去的时间）

EVERY interval 
[STARTS timestamp [+ INTERVAL interval]] 
[ENDS timestamp [+ INTERVAL interval]] （在某个事件范围内，以某个时间间隔，周期性地执行事件）

interval可以是
YEAR | QUARTER | MONTH | DAY | HOUR | MINUTE |  
WEEK | SECOND | YEAR_MONTH | DAY_HOUR | DAY_MINUTE | 
DAY_SECOND | HOUR_MINUTE | HOUR_SECOND | MINUTE_SECOND
*/
```
```SQL
# 实例1
CREATE
DEFINER=`root`@`%` 
EVENT `tt` 
ON SCHEDULE 
AT '2017-07-25 22:40:00' 
ON COMPLETION PRESERVE 
ENABLE
DO 
INSERT INTO eve VALUES(NOW())

# 实例2
CREATE 
DEFINER=`root`@`%` 
EVENT 
`get_plans_day` 
ON SCHEDULE 
EVERY 1 DAY 
STARTS '2017-06-01 11:59:50' 
ON COMPLETION NOT PRESERVE 
ENABLE 
DO 
CALL pro_day_plan
```

### 事件的修改
```SQL
-- 修改事件
ALTER 
[DEFINER = {user | CURRENT_USER}]
EVENT event_name
[ON SCHEDULE schedule]
[ON COMPLETION [NOT] PRESERVE]
[RENAME TO new_event_name] 
[ENABLE | DISABLE | DISABLE ON SLAVE]
[COMMENT 'comment']
DO event_body;
```

### 事件的删除
```SQL
DROP EVENT [IF EXISTS] event_name; 
```

### 事件相关查询
```SQL
SHOW CREATE EVENT event_name;-- 查询某个事件定义的相关信息

SELECT * FROM mysql.event;-- 查询所有事件的信息

SELECT * FROM information_schema.events;-- 查询所有事件的信息

SHOW EVENTS;-- 查询所有事件的信息
```

## 用户管理
### 创建用户
```SQL
CREATE USER 'username'@'host' IDENTIFIED BY 'password'; 
-- username：你将创建的用户名, 
-- host：指定该用户在哪个主机上可以登陆,如果是本地用户可用localhost, 如果想让该用户可以从任意远程主机登陆,可以使用通配符%. 
-- password：该用户的登陆密码,密码可以为空,如果为空则该用户可以不需要密码登陆服务器. 
-- 创建的用户只能看到information_schema数据库，无法看到其它数据库

CREATE USER 'dog'@'localhost' IDENTIFIED BY '123456'; 

CREATE USER 'pig'@'192.168.1.105' IDENDIFIED BY '123456'; 

CREATE USER 'pig'@'%' IDENTIFIED BY '123456'; 

CREATE USER 'pig'@'%' IDENTIFIED BY ''; 

CREATE USER 'pig'@'%'; 

SELECT USER();-- 显示当前用户
```

### 删除用户
```SQL
DROP USER 'username'@'host';
```

### 授权
```SQL
GRANT privileges ON databasename.tablename TO 'username'@'host' 
-- privileges：用户的操作权限,如SELECT , INSERT , UPDATE 等(详细列表见该文最后面).如果要授予所的权限则使用ALL.;
-- databasename：数据库名
-- tablename：表名
-- 如果要授予该用户对所有数据库和表的相应操作权限则可用*表示, 如*.*. 

GRANT SELECT ON xmdk.a TO 'pig'@'192.168.1.105'; 

GRANT SELECT, INSERT ON test.user TO 'pig'@'%';

GRANT ALL ON *.* TO 'pig'@'%';

GRANT EVENT ON xmdk.* TO 'pig'@'192.168.1.105';

GRANT TRIGGER ON xmdk.a TO 'pig'@'192.168.1.105';

-- 注意:用以上命令授权的用户不能给其它用户授权,如果想让该用户可以授权,用以下命令: 
GRANT privileges ON databasename.tablename TO 'username'@'host' WITH GRANT OPTION;
-- 或下面两句
GRANT privileges ON databasename.tablename TO 'username'@'host';
GRANT GRANT OPTION ON databasename.tablename TO 'username'@'host';

FLUSH PRIVILEGES;-- 授权之后用此命令刷新权限
```

### 设置与更改用户密码 
```SQL
SET PASSWORD FOR 'username'@'host' = PASSWORD('newpassword');

-- 如果是当前登陆用户用
SET PASSWORD = PASSWORD("newpassword"); 

-- 例子
SET PASSWORD FOR 'pig'@'%' = PASSWORD("123456"); 
```

### 撤销用户权限 
```SQL
REVOKE privilege ON databasename.tablename FROM 'username'@'host'; 
-- privilege, databasename, tablename - 同授权部分. 

REVOKE SELECT ON *.* FROM 'pig'@'%'; 
-- 例子

-- 注意: 假如你在给用户'pig'@'%'授权的时候是如下命令:
GRANT SELECT ON test.user TO 'pig'@'%'
-- 则使用如下命令并不能撤销该用户对test数据库中user表的SELECT操作
REVOKE SELECT ON *.* FROM 'pig'@'%';
-- 相反,如果授权使用的是
GRANT SELECT ON *.* TO 'pig'@'%';
REVOKE SELECT ON test.user FROM 'pig'@'%';
-- 则此命令不能撤销该用户对test数据库中user表的SELECT权限. 

-- 具体信息可以用如下命令查看
SHOW GRANTS FOR 'pig'@'%';  
```

#### privilege关键字列表及描述

关键字 | 描述
---|---
SELECT | Allows use of SELECT.
UPDATE | Allows use of UPDATE.
INSERT | Allows use of INSERT.
DELETE | Allows use of DELETE.
FILE | Allows use of SELECT... INTO OUTFILE and LOAD DATA INFILE.
CREATE | Allows use of CREATE TABLE.
ALTER | Allows use of ALTER TABLE.
DROP | Allows use of DROP TABLE.
INDEX | Allows use of CREATE INDEX and DROP INDEX.
CREATE TEMPORARY TABLES | Allows use of CREATE TEMPORARY TABLE.
SHOW VIEW | Allows use of SHOW CREATE VIEW.
ALTER ROUTINE | Alters or drops stored routines.
CREATE ROUTINE | Creates stored routines.
EXECUTE | Allows the user to run stored routines.
CREATE VIEW | Allows use of CREATE VIEW.
EVENT | Allows use of EVENT.
TRIGGER | Allows use of TRIGGER.
CREATE USER | Allows use of CREATE USER, DROP USER, RENAME USER, and REVOKE ALL PRIVILEGES.
GRANT OPTION | 拥有grant option，就可以将自己拥有的权限授予其他用户（仅限于自己已经拥有的权限）
SUPER | Allows use of CHANGE MASTER, KILL, PURGE MASTER LOGS, and SET GLOBAL SQL statements. Allows mysqladmin debug command. Allows one extra connection to be made if maximum connections are reached.
RELOAD | Allows use of FLUSH.
PROCESS | Allows use of SHOW FULL PROCESSLIST.
SHUTDOWN | Allows use of mysqladmin shutdown.
SHOW DATABASES | Allows use of SHOW DATABASES.
LOCK TABLES | Allows use of LOCK TABLES on tables for which the user also has SELECT privileges.
REPLICATION CLIENT | Allows the user to ask where slave or master servers are.
REPLICATION SLAVE | Needed for replication slaves.
REFERENCES | 有了REFERENCES权限，用户就可以将其它表的一个字段作为某一个表的外键约束。
USAGE | Allows connection without any specific privileges.