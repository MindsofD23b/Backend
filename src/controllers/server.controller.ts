import type { Request, Response, NextFunction } from "express";
import { Logger } from "../utils/logger";
import { serverRepository } from "../repositories/server.repository";
import { SecureRequest } from "../types/request";

type CreateServerBody = {
    serverName?: string;
    eula?: boolean;
    version?: string;
    mode?: "survival" | "creative" | "hardcore" | "adventure";
    difficulty?: "peaceful" | "easy" | "normal" | "hard";
    maxPlayers?: number;
    viewDistance?: number;
    enableCommandBlock?: boolean;
    levelName?: string;
    levelType?: string;
    seed?: number;
    generateStructures?: boolean;
    allowNether?: boolean;
    spawnAnimals?: boolean;
    spawnMonsters?: boolean;
    pvp?: boolean;
    enableWhiteList?: boolean;
    whitelist?: string[];
    onlineMode?: boolean;
    enableRcon?: boolean;
    rconPort?: number;
    memory?: string;
};



export const addServerController = async (
    req: SecureRequest,
    res: Response,
    _next: NextFunction
) => {

    const body: CreateServerBody = req.body ?? {};

    const {
        serverName = "My Minecraft Server",
        eula = true,
        version = "1.20.4",
        mode = "survival",
        difficulty = "normal",
        maxPlayers = 10,
        viewDistance = 10,
        enableCommandBlock = false,
        levelName = "world",
        levelType = "default",
        seed = 0,
        generateStructures = true,
        allowNether = true,
        spawnAnimals = true,
        spawnMonsters = true,
        pvp = true,
        enableWhiteList = true,
        whitelist = ["Blackpatrickstar"],
        onlineMode = true,
        enableRcon = true,
        rconPort = 25575,
        memory = "2G",
    } = body;



    Logger.log("Adding a new server with the following configuration:");
    Logger.log(`EULA: ${eula}`);
    Logger.log(`Version: ${version}`);
    Logger.log(`Mode: ${mode}`);
    Logger.log(`Difficulty: ${difficulty}`);
    Logger.log(`Max Players: ${maxPlayers}`);
    Logger.log(`View Distance: ${viewDistance}`);
    Logger.log(`Enable Command Block: ${enableCommandBlock}`);
    Logger.log(`Level Name: ${levelName}`);
    Logger.log(`Level Type: ${levelType}`);
    Logger.log(`Seed: ${seed}`);
    Logger.log(`Generate Structures: ${generateStructures}`);
    Logger.log(`Allow Nether: ${allowNether}`);
    Logger.log(`Spawn Animals: ${spawnAnimals}`);
    Logger.log(`Spawn Monsters: ${spawnMonsters}`);
    Logger.log(`PVP: ${pvp}`);
    Logger.log(`Enable Whitelist: ${enableWhiteList}`);
    Logger.log(`Whitelist: ${whitelist.join(", ")}`);
    Logger.log(`Online Mode: ${onlineMode}`);
    Logger.log(`Enable RCON: ${enableRcon}`);
    Logger.log(`RCON Port: ${rconPort}`);
    Logger.log(`Memory Allocation: ${memory}`);

    await serverRepository.create(
        serverName,
        version,
        req.user.id,
    );

    res.status(201).json({ message: "Server added successfully" });
};

export const getServersController = async (
    req: SecureRequest,
    res: Response,
    _next: NextFunction
) => {
    Logger.log("Retrieving list of servers");

    const servers = await serverRepository.findAllForUser(req.user.id);

    res.json({
        servers
    });
};

export const deleteServerController = async (
    req: Request<{ id: string }>,
    res: Response,
    _next: NextFunction
) => {
    const serverId = req.params.id;
    Logger.log(`Deleting server with ID: ${serverId}`);

    await serverRepository.delete(serverId);
    res.json({ message: `Server ${serverId} deleted successfully` });
};

export const stopAllServersController = async (
    req: SecureRequest,
    res: Response,
    _next: NextFunction
) => {
    Logger.log("Stopping all servers");

    for (const server of await serverRepository.findAllForUser(req.user.id)) {
        await serverRepository.stateUpdate(server.id, "STOPPED");
    };

    res.json({ message: "All servers stopped successfully" });
};