/**
 * Main entry point for WhatsApp MCP Backend
 */

import { createStore } from './store/index.js';
import { WhatsAppClient } from './whatsapp/client.js';
import { MessageService } from './service/message.service.js';
import { ChatService } from './service/chat.service.js';
import { ContactService } from './service/contact.service.js';
import { WhatsAppMCPServer } from './mcp/server.js';
import { logger } from './util/logger.js';
import { env } from './config/environment.js';

async function main() {
  logger.info('Starting WhatsApp MCP Backend...');
  logger.info(`Environment: ${env.nodeEnv}`);
  logger.info(`Data Store Type: ${env.dataStoreType}`);
  logger.info(`MCP Transport: ${env.mcpTransportType}`);

  try {
    // Initialize data store
    logger.info('Initializing data store...');
    const store = createStore();
    await store.initialize();

    // Initialize WhatsApp client
    logger.info('Initializing WhatsApp client...');
    const whatsappClient = new WhatsAppClient(store);
    await whatsappClient.initialize();

    // Initialize services
    logger.info('Initializing services...');
    const messageService = new MessageService(store, whatsappClient);
    const chatService = new ChatService(store);
    const contactService = new ContactService(store);

    // Initialize MCP server
    logger.info('Initializing MCP server...');
    const mcpServer = new WhatsAppMCPServer(
      messageService,
      chatService,
      contactService,
      whatsappClient
    );

    // Start MCP server
    logger.info('Starting MCP server...');
    await mcpServer.start();

    logger.info('WhatsApp MCP Backend started successfully');

    // Handle graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down...');
      await whatsappClient.close();
      await store.close();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    logger.error('Failed to start backend', error);
    process.exit(1);
  }
}

main();
