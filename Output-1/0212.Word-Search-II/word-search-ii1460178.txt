// https://leetcode.com/problems/word-search-ii/solutions/1460178/c-iterative-solution-using-trie-and-dfs/
public class Solution {
    public IList<string> FindWords(char[][] board, string[] words) {
        //a dummy head for Trie structure
        var head = new TrieNode();
        var res = new List<string>();
        //building the trie
        foreach(var w in words){
            var cu = head;
            for(var i =0; i<w.Length; i++){
                if(cu.children.ContainsKey(w[i])){
                    cu = cu.children[w[i]];
                    if(i==w.Length-1){
                        cu.Word = w;
                    }
                }else{
                    var t = new TrieNode(w[i]);
                    t.parent = cu;
                    if(i==w.Length-1){
                        t.Word = w;
                    }
                    cu.children.Add(w[i], t);
                    cu = cu.children[w[i]];
                }
            }
        }
        for(var i = 0; i<board.Length; i++){
            for(var j = 0; j<board[i].Length; j++){
                if(head.children.ContainsKey(board[i][j])){
                    foreach(var w in DFS(board, head.children[board[i][j]], i, j)){
                        res.Add(w);
                    }
                }
            }
        }
        return res;
    }
    
    public IEnumerable<String> DFS(char[][] board, TrieNode node, int i, int j){
        var stack = new Stack<(TrieNode node, int i, int j, HashSet<(int, int)> hs)>();
        stack.Push((node, i, j, new HashSet<(int, int)>(){(i, j)}));
        while(stack.Count>0){
            var item = stack.Pop();
            if(item.node.Word!=""){
                yield return item.node.Word;
                item.node.Word = "";
                var n = item.node;
                var del = false;
                while(n!=null && n.children.Count==0){
                    del = true;
                    var p = n.parent;
                    if(p!=null){
                        p.children.Remove(n.v);
                    }
                    n = p;
                }
                if(del) continue;
            }
            var x = item.i;
            var y = item.j;
            if(x-1>=0 && item.node.children.ContainsKey(board[x-1][y]) && !item.hs.Contains((x-1, y))){
                var t = new HashSet<(int, int)>(item.hs);
                t.Add((x-1, y));
                stack.Push((item.node.children[board[x-1][y]], x-1, y, t));
            }
            if(y-1>=0 && item.node.children.ContainsKey(board[x][y-1]) && !item.hs.Contains((x, y-1))){
                var t = new HashSet<(int, int)>(item.hs);
                t.Add((x, y-1));
                stack.Push((item.node.children[board[x][y-1]], x, y-1, t));
            }
            if(x+1<board.Length && item.node.children.ContainsKey(board[x+1][y]) && !item.hs.Contains((x+1, y))){
                var t = new HashSet<(int, int)>(item.hs);
                t.Add((x+1, y));
                stack.Push((item.node.children[board[x+1][y]], x+1, y, t));
            }
            if(y+1<board[x].Length && item.node.children.ContainsKey(board[x][y+1]) && !item.hs.Contains((x, y+1))){
                var t = new HashSet<(int, int)>(item.hs);
                t.Add((x, y+1));
                stack.Push((item.node.children[board[x][y+1]], x, y+1, t));
            }
        }
    }

}

public class TrieNode{
    public char v {set; get;}
    public Dictionary<char, TrieNode> children {get; set;}
    public string Word {get; set;}
    public TrieNode parent {get; set;}
    
    public TrieNode(){
        children = new Dictionary<char, TrieNode>();
        Word = "";
    }
    
    public TrieNode(char va){
        v = va;
        children = new Dictionary<char, TrieNode>();
        Word = "";
    }
}