// https://leetcode.com/problems/sum-of-distances-in-tree/solutions/2937425/rust-pre-order-and-post-order-dfs-100/
impl Solution {
    pub fn sum_of_distances_in_tree(n: i32, edges: Vec<Vec<i32>>) -> Vec<i32> {
        fn dfs(
            graph: &Vec<Vec<usize>>,
            counter: &mut Vec<i32>,
            res:  &mut Vec<i32>,
            node: i32, 
            parent: i32
        ) {
            for neig in graph[node as usize].iter() {
                if *neig as i32 != parent {
                    dfs(graph, counter, res, *neig as i32, node);
                    counter[node as usize] += counter[*neig];
                    res[node as usize] += res[*neig] + counter[*neig];
                }
            }
            counter[node as usize] += 1;
        }
        fn dfs2(
            graph: &Vec<Vec<usize>>,
            counter: &mut Vec<i32>,
            res:  &mut Vec<i32>,
            node: i32, 
            parent: i32
        ) {
            let n = graph.len() as i32;
            for neig in graph[node as usize].iter() {
                if *neig as i32 != parent {
                    res[*neig] = res[node as usize] -  counter[*neig] + n - counter[*neig];
                    dfs2(graph, counter, res, *neig as i32, node);
                }
            }
        }
        let mut graph: Vec<Vec<usize>> = vec![vec![]; n as usize];
        for edge in edges.iter() {
            graph[edge[0] as usize].push(edge[1] as usize);
            graph[edge[1] as usize].push(edge[0] as usize);
        }
        let mut counter: Vec<i32> = vec![0; n as usize];
        let mut res: Vec<i32> = vec![0; n as usize];
        dfs(&graph, &mut counter, &mut res, 0, -1);
        dfs2(&graph, &mut counter, &mut res, 0, -1);
        res
    }
}