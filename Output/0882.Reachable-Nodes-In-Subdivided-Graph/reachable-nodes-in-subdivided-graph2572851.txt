// https://leetcode.com/problems/reachable-nodes-in-subdivided-graph/solutions/2572851/rust-dijkstra-like-approach/
use std::collections::{BinaryHeap, HashMap};

const IDX_FROM: usize = 0;
const IDX_TO: usize = 1;
const IDX_SPLIT: usize = 2;

pub fn reachable_nodes(edges: Vec<Vec<i32>>, max_moves: i32, n: i32) -> i32 {
    assert!(n > 0);
    let n = n as usize;

    assert!(max_moves >= 0);
    let m = max_moves as usize;

    let mut graph = vec![vec![]; n];
    let mut split = HashMap::new();

    // Build an adjacency list representation of the graph from the
    // given edges and remember the the number of new nodes in the edges
    // after they have been subdivided
    for edge in edges {
        let from = edge[IDX_FROM] as usize;
        let to = edge[IDX_TO] as usize;

        graph[from].push(to);
        graph[to].push(from);

        // remember how many new nodes are between the (from, to) nodes
        // In order to avoid storing the value twice, i.e. (from to)=x 
        // and (to, from)=x,we sort the nodes' ids in ascending order
        split.insert((from.min(to), from.max(to)), edge[IDX_SPLIT] as usize);
    }

    // Standard BFS/DFS/Dijkstra setup
    let mut visited = vec![false; n];
    let mut queue = BinaryHeap::new();
    queue.push((m, 0usize));

    let mut answer = 0;
    while let Some((remaining_moves, node)) = queue.pop() {
        if visited[node] {
            continue;
        }
        visited[node] = true;

        // Count the new unvisited node from the original graph
        answer += 1;

        // If we cannot perform any moves from this node, 
        // then we can stop early and avoid visiting its 
        // child nodes
        if remaining_moves == 0 {
            continue;
        }

        for &child in graph[node].iter() {
            let from = node.min(child);
            let to = node.max(child);

            if let Some(moves) = split.get_mut(&(from, to)) {
                // Because we visit each node at most once, this value 
                // wither holds the number of moves to reach the child
                // node in the original graph, or the number of unvisited 
                // "new nodes" plus 1. Therefore we have to check if we 
                // have already visited the child node before pushing it to 
                // the queue
                let moves_to_node = *moves + 1;

                // If we can reach the child node, and we have not yet 
                // processed it, then push it to the queue and update the 
                // number of moves we can perform starting from it
                //
                // Note that because we visit each node at most once, there is
                // no danger of visiting the child node later when we have 
                // decreased the number of unvisited nodes. I.e. we'll never 
                // attempt another `node -> child` move ever again. Also
                // we will never visit `node` from `child` in the future, 
                // because we have marked it as visited
                if moves_to_node <= remaining_moves && !visited[child] {
                    queue.push((remaining_moves - moves_to_node, child));
                }

                // Add the number of "new nodes" we have visited starting from
                // "node" and moving towards "child". Also update the number of
                // unvisited "new nodes" between those two nodes
                answer += remaining_moves.min(*moves);
                *moves -= remaining_moves.min(*moves);
            }
        }
    }

    answer as i32
}