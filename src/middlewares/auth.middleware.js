import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config.js";
import { Scalekit } from '@scalekit-sdk/node';
import { SK_ENV_URL, SK_CLIENT_ID, SK_CLIENT_SECRET, BASE_URL_MCP, PORT_MCP } from "../config/config.js";


const scalekit = new Scalekit(SK_ENV_URL, SK_CLIENT_ID, SK_CLIENT_SECRET);

// verificacion con JWT
export const authMdw = (req, res, next) => {
    try {      
      const { token } = req.cookies;      
      // verifica que exista token
      if (!token)
        return res
    .status(401)
    .json({status: 'error', message: "No token, authorization denied" });
    
    // verifica que el token sea el del servidor
      jwt.verify(token, TOKEN_SECRET, (error, user) => {
        if (error) {
          return res.status(401).json({ message: "Token is not valid" });
        }
        req.user = user;
        next();
      });
    } catch (error) {
      return res.status(500).json({status: 'error', message: error.message });
    }
  };

  // ========== MIDDLEWARE PARA LLMs (SCALEKIT) ==========
export const llmAuthMdw = (requiredScopes) => {
  console.log('entrando a llmAuthMdw con scopes:', requiredScopes);
  console.log('BASE_URL_MCP:', BASE_URL_MCP);
  console.log('PORT_MCP:', PORT_MCP);
  console.log('SK_ENV_URL:', SK_ENV_URL);

  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') 
        ? authHeader.split('Bearer ')[1]?.trim() 
        : null;

      if (!token) {
        return res.status(401).json({ message: "Token is not valid" });
      }     

      // Validar token con Scalekit
      const validateOptions = { 
        audience: [`${BASE_URL_MCP}/`] 
      };
      
      
      // Si se requieren scopes específicos
      // if (requiredScopes.length > 0) {
      //   validateOptions.requiredScopes = requiredScopes;
      // }

      const decodedToken = await scalekit.validateToken(token, validateOptions);
      console.log('decodedToken', decodedToken)
      // Verificar scopes manualmente si es necesario
      if (requiredScopes.length > 0) {
        const permissions = decodedToken.permissions || [];
        const hasAllScopes = requiredScopes.every(perm => 
          permissions.includes(perm)
        );

        // const hasAllScopes = requiredScopes.every(scope => 
        //   decodedToken.permissions?.includes(scope)
        // );
        
        if (!hasAllScopes) {
          return res.status(403).json({ 
            status: 'error',
            error: `Insufficient permissions`,
          });
        }
      }

      // Guardar info del token para uso posterior
      // req.llmToken = decodedToken;
      // req.scopes = decodedToken.scopes || [];
      next();

    } catch (error) {
      return res.status(401).json({ 
        status: ' error',
        message: `Invalid LLM token: ${error.message}` 
      });
    }
  };
};


export const verifyLlmAdminRole = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') 
        ? authHeader.split('Bearer ')[1]?.trim() 
        : null;

      if (!token) {
        return res.status(401).json({ message: "Token is not valid" });
      }      

      // Validar token con Scalekit
      const validateOptions = { 
        audience: [`${BASE_URL_MCP}:${PORT_MCP}/`]
      };      

      const decodedToken = await scalekit.validateToken(token, validateOptions);     

      if (!(decodedToken.roles.includes("member"))) {       
          return res.status(403).json({ 
            status: "error",
            message: 'Insufficient permissions you need to be an admin user',
          });
      }    
      next();

    } catch (error) {
      console.error('LLM Auth Error:', error);
      return res.status(401).json({ 
        error: 'Invalid LLM token',
        details: error.message 
      });
    }
};