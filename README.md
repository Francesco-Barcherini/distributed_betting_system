# distributed_betting_system

## Architecture

1. load balancer that acts also as reverse proxy (unified IP from outside) `10.2.1.11`
2. WEB server for serving web application and REST endpoints for authenticatino with JWT `10.2.1.12`
3. MySQL database for user information `10.2.1.27`
4. Main Erlang process for spawning erlang processes `10.2.1.28`
5. Two machines for spawning Erlang game processes `10.2.1.XX/XX`

diagram of the design


```mermaid
graph TD
    %% ===== Livello 1: Load Balancer =====
    LB[Load Balancer / Reverse Proxy]

    %% ===== Livello 2: Servizi affiancati =====
    WS[WebServer]
    SPAWN[SpawnService]

    %% ===== Livello 3: Game Cluster =====
    subgraph GAME_CLUSTER[GameServiceCluster]
        direction TB
        NODE1[GameNode1]
    end

    %% ===== Livello 3: Database =====
    SQL[MySQL]

    %% ===== Collegamenti =====
    LB --> WS
    LB --> SPAWN
    LB --> GAME_CLUSTER
    SPAWN --> GAME_CLUSTER
    WS --> SQL
```



