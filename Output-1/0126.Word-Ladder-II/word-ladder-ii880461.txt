// https://leetcode.com/problems/word-ladder-ii/solutions/880461/rust-bfs/
use std::collections::{HashMap, HashSet, VecDeque};
use std::i32::MAX;

impl Solution {
    //     Complexity Analysis
    //     Time O(M^2 x N) where M is the length of each word and N is the total number of words
    //     in the input word list.
    //     For each word in the word list, we iterate over its length to find all the intermediate
    //     words corresponding to it. Since the length of each word is M and we have N words,
    //     the total number of iterations the algorithm takes to create all_combo_dict is M × N.
    //     Additionally, forming each of the intermediate word takes O(M) time because of
    //     the substring operation used to create the new string. This adds up to a complexity of
    //     O(M^2 * N)

    //  Breadth first search in the worst case might go to each of the N words. For each word,
    //  we need to examine M possible intermediate words/combinations. Notice, we have used
    //  the substring operation to find each of the combination. Thus, M combinations take
    //  O(M^ 2)  time. As a result, the time complexity of BFS traversal would also
    //  be O(M^2 x N)
    //
    // Space Complexity: O(M^2 x N)
    // same as above
    //
    // Optimization: We can definitely reduce the space complexity of this algorithm by storing
    // the indices corresponding to each word instead of storing the word itself.
    // 基于上面的思路我们考虑如何编程实现。

    // 方便起见，我们先给每一个单词标号，即给每个单词分配一个 id。创建一个由单词 word到 id
    // 对应的映射 word_id，并将 begin_word 与 word_list 中所有的单词都加入这个映射中。
    // 之后我们检查 end_word 是否在该映射内，若不存在，则输入无解。我们可以使用哈希表实现
    // 上面的映射关系。
    // 同理我们可以创建一个由对应 id 到 word 的映射 id_word，方便最后输出结果。由于 id
    // 实际上是整数且连续，所以这个映射用数组实现即可。
    // 接下来我们将 id_word 中的单词两两匹配，检查它们是否可以通过改变一个字母进行互相转换。
    // 如果可以，则在这两个点之间建一条双向边。
    // 为了保留相同长度的多条路径，我们采用 cost 数组，其中 cost[i] 表示 begin_word 对应的点
    // 到第 i 个点的代价（即转换次数）。初始情况下其所有元素初始化为无穷大。
    // 接下来将起点加入队列开始广度优先搜索，队列的每一个节点中保存从起点开始的所有路径。
    // 对于每次取出的节点 now，每个节点都是一个数组，数组中的最后一个元素为当前路径的最后节点 last :
    // 若该节点为终点，则将其路径转换为对应的单词存入答案;
    // 若该节点不为终点，则遍历和它连通的节点（假设为 to ）中满足
    // cost[to] >= cost[now] + 1cost[to]>=cost[now]+1 的加入队列，并更新
    // cost[to] = cost[now] + 1cost[to]=cost[now]+1。
    // 如果 cost[to] < cost[now] + 1cost[to]<cost[now]+1，说明这个节点已经被访问过，不需要再考虑。

    pub fn find_ladders(
        begin_word: String,
        end_word: String,
        word_list: Vec<String>,
    ) -> Vec<Vec<String>> {
        // 单词到id的映射
        let mut word_id = HashMap::new();
        // id到单词的映射
        let mut id_word = vec![];
        let mut id = 0;

        // 将wordList所有单词加入wordId中 相同的只保留一个 // 并为每一个单词分配一个id
        for word in word_list.iter() {
            if !word_id.contains_key(word) {
                word_id.insert(word.to_string(), id);
                id += 1;
                id_word.push(word.to_string());
            }
        }

        // 若endWord不在wordList中 则无解
        if !word_id.contains_key(&end_word) {
            return vec![];
        }

        // 把beginWord也加入wordId中
        if !word_id.contains_key(&begin_word) {
            word_id.insert(begin_word.to_string(), id);
            id += 1;
            id_word.push(begin_word.to_string());
        }
        //  图的边
        let mut edges = vec![vec![]; id_word.len()];

        //添加边
        for i in 0..id_word.len() {
            for j in (i + 1)..id_word.len() {
                // 若两者可以通过转换得到 则在它们间建一条无向边
                if Self::transform_check(
                    id_word.get(i).unwrap().as_str(),
                    id_word.get(j).unwrap().as_str(),
                ) {
                    edges[i].push(j);
                    edges[j].push(i);
                }
            }
        }

        let dest = *word_id.get(&end_word).unwrap();
        let begin = *word_id.get(&begin_word).unwrap();

        let mut ans = vec![];
        let mut cost = vec![MAX; id];

        // 将起点加入队列 并将其cost设为0
        let mut queue = VecDeque::new();
        let mut begin_vec = vec![];
        begin_vec.push(begin);
        queue.push_back(begin_vec);
        cost[begin] = 0;

        // BFS
        while let Some(now) = queue.pop_front() {
            // 最近访问的点
            if let Some(last) = now.last() {
                if *last == dest {
                    let mut tmp = vec![];
                    for index in now.iter() {
                        tmp.push(id_word[*index as usize].to_string());
                    }

                    ans.push(tmp);
                } else {
                    // 该点不为终点 继续搜索
                    for i in 0..edges[*last as usize].len() {
                        let to = *edges[*last as usize].get(i).unwrap();
                        // 此处<=目的在于把代价相同的不同路径全部保留下来
                        if cost[*last as usize] + 1 <= cost[to as usize] {
                            cost[to as usize] = cost[*last as usize] + 1;
                            // 把to加入路径中
                            let mut tmp = vec![];
                            tmp.extend(now.iter().copied());
                            tmp.push(to);
                            queue.push_back(tmp);
                        }
                    }
                }
            }
        }

        ans
    }

    fn transform_check(s1: &str, s2: &str) -> bool {
        let mut diff = 0;
        for (c1, c2) in s1.chars().zip(s2.chars()) {
            if c1 != c2 {
                diff += 1;
            }
        }

        diff == 1
    }
}