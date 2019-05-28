<?php
namespace Design\DesignBundle\Services\PdfExterno3;
/**
 * Description of PhpGenDefinitionSql
 *
 * @author jkober
 */
class PhpGenDefinitionSql {
    /**
     *
     * @var Design\DesignBundle\Services\PdfExterno3\PhpGenPdfDb 
     */
    private $db=null;
    /**
     * 
     * @param Design\DesignBundle\Services\PdfExterno3\PhpGenPdfDb $db
     */
    public function __construct($db) {
        $this->db =$db;
    }
    public function get($json){
        //--------------------------------------------------------------------------------------------------------------
        $db=PhpGenPdfDb::getConexion();
        //--------------------------------------------------------------------------------------------------------------
        if (trim($json->bdName) != "") {
            $db->ejecute("use " . $json->bdName);
        }
        //--------------------------------------------------------------------------------------------------------------
        $db->beginTransaction();
        //--------------------------------------------------------------------------------------------------------------
        if ($json->where != "" ) {
            $parametrosX = array();
            if (is_array($json->extras)) {
                foreach ($json->extras as $v) {
                    if (substr($v->name, 0, 1) == ":") {
                        $parametrosX[$v->name] = $v->value;
                    }
                }
            }
            $FunctionVuelo = create_function('$p', $json->where);
            $returns = $FunctionVuelo($parametrosX);
            if (is_array($returns) && count($returns)>0 )  {
                if ( isset($returns["Sql"])){
                    if ( trim($returns["Sql"])!="") {
                        $json->ssql=$returns["Sql"];
                    }
                }
                $a= implode(",", $returns);
                $pattern = '/:[a-z0-9]*/';
                preg_match_all($pattern, $a, $m,PREG_PATTERN_ORDER);
                if ( isset($m[0])) {
                    $cc = array_flip($m[0]);

                    foreach ( $cc as $k => $v ){
                        if ( ! isset($parametrosX[$k]) ) {
                            throw new \Exception("Falta un parametro {$k}");
                        }
                    }
                    preg_match_all($pattern, $json->ssql, $m,PREG_PATTERN_ORDER);
                    if ( isset($m[0])) {
                        $cc1 = array_flip($m[0]);
                    }else {
                        $cc1=array();
                    }

                    foreach ( $parametrosX as $k => $v ){
                        if ( ! isset($cc[$k]) ) {
                            if ( ! isset($cc1[$k]) ) {
                                unset($parametrosX[$k]);
                            }
                        }
                    }
                }
                foreach ($returns as $k => $v ) {
                    $json->ssql = str_replace("{$k}", $v, $json->ssql);
                }

            }
        }else {
            $parametrosX=array();
            //----------------------------------------------------------------------
            if (is_array($json->extras)) {
                foreach ($json->extras as $v) {
                    if (substr($v->name, 0, 1) == ":") {
                        $json->ssql = str_replace("" . $v->name . "", $v->value, $json->ssql);

                    } else {
                        $json->ssql = str_replace("{" . $v->name . "}", $v->value, $json->ssql);
                    }
                }
            }
        }
        //----------------------------------------------------------------------
        // aca falta agregar los parametros extras para que sean reemplazados
        //----------------------------------------------------------------------
        $error          = false;//----------------------------------------------
        $sqlLite        = false;//----------------------------------------------
        $sqlLiteTable   = false;//----------------------------------------------
        //----------------------------------------------------------------------
        try {
            $sqlTempo = "create temporary table veoEstruc {$json->ssql} limit 0,0";
            $db->ejecuteParams($sqlTempo,$parametrosX);
            //$db->ejecute($sqlTempo);
        }catch (\Exception $e1){
            $error=true;
        }
        if ($error) {
            try {
                if(stristr($json->ssql, 'select ') === FALSE) {
                    $sqlTempo = "select 1 from sqlite_master where type='table' and name='". trim($json->ssql)."'";
                    $rr = $db->query($sqlTempo);
                    if (  $r = $rr->fetch()  ) {
                        $sqlLiteTable=true;
                    }else{
                        throw new \Exception("La tabla ->".trim($json->ssql)." no Existe");
                    }
                }else{
                    $sqlTempo = "create temp table veoEstruc as {$json->ssql}";
                    $db->ejecute($sqlTempo);
                }
                $error=false;
                $sqlLite=true;
            }catch(\Exception $e2) {
            }
        }
        if ($error){
            
            throw new \Exception($e1->getMessage()."\n".$e2->getMessage());
        }
        
        //CREATE TEMP TABLE tableName AS select * from Clase
        
        //$db->executeQuery($sqlTempo);
        //----------------------------------------------------------------------
        if ($sqlLite) {
            if ($sqlLiteTable) {
                $recordSet          = $db->query("PRAGMA table_info (". trim($json->ssql) ." ) " );
                
            }else{
                $recordSet          = $db->query("PRAGMA table_info (veoEstruc) ");
            }
        }else{
            $recordSet          = $db->query("SHOW FIELDS FROM veoEstruc ");
        }
        //$recordSet          = $db->executeQuery("SHOW FIELDS FROM veoEstruc ");
        //----------------------------------------------------------------------
        $_TableDefinition   = array();
        $i                  = 0;
        //----------------------------------------------------------------------
        while ($row = $recordSet->fetch()) {
            $_TableDefinition[$i] = (Object) array();
            if ($sqlLite){
                $_TableDefinition[$i]->name                     = $row["name"];
                $_TableDefinition[$i]->nameDisp                 = $row["name"] . "-> " . $row["type"];
                $_TableDefinition[$i]->extra                    = (Object) array();
                $_TableDefinition[$i]->extra->name              = $row["name"];
                $_TableDefinition[$i]->extra->nameDisp          = $row["name"] . "-> " . $row["type"];
                $_TableDefinition[$i]->extra->primary_key       = false;
                if ($row["pk"] == "1") {
                    $_TableDefinition[$i]->extra->primary_key   = true;
                }
                $_TableDefinition[$i]->extra->null              = true;
                if ($row["notnull"] == "0") {
                    $_TableDefinition[$i]->extra->null          = false;
                }
                //------------------------------------------------------------------
                //$_TableDefinition[$i]->extra->extra             = $row["Extra"];
                $_TableDefinition[$i]->extra->extra             = "";
                preg_match('/^([^ (]+)(\((.+)\))?([ ](.+))?$/u', $row['type'], $f);
                if ( $row['type'] == "") {
                    $f[1] ="varchar";
                    $f[3] =40;
                }
                $F = strtoupper($f[1]);
                if ($F == "REAL" ) {
                    $F = "DECIMAL";
                    
                }
                //------------------------------------------------------------------
                 if ($F == "TINYINT" or $F == "SMALLINT" or $F == "MEDIUMINT" or $F == "INT" or $F == "INTEGER" or $F == "BIGINT" or $F == "DECIMAL" or $F == "FLOAT") {
                    $_TableDefinition[$i]->extra->numeric = true;
                } else {
                    $_TableDefinition[$i]->extra->numeric = false;
                }

                if (isset($f[3])) {
                    if (strpos($f[3], ",") === false) {
                        if ($F =="TEXT") {
                            $f[1] ="varchar";
                        }
                        $_TableDefinition[$i]->extra->max_length    = (integer) $f[3];
                        $_TableDefinition[$i]->extra->decimal       = 0;
                    } else {
                        $aux = explode(",", $f[3]);
                        $_TableDefinition[$i]->extra->max_length    =  (integer) $aux[0];
                        $_TableDefinition[$i]->extra->decimal       =  (integer) $aux[1];
                    }
                } else {
                    $_TableDefinition[$i]->extra->max_length        = 6;
                    $_TableDefinition[$i]->extra->decimal           = 0;
                }
                //--------------------------------------------------------------
                $_TableDefinition[$i]->extra->type                  = $f[1];
                //--------------------------------------------------------------
            }else{
                $_TableDefinition[$i]->name                     = $row["Field"];
                $_TableDefinition[$i]->nameDisp                 = $row["Field"] . "-> " . $row["Type"];
                $_TableDefinition[$i]->extra                    = (Object) array();
                $_TableDefinition[$i]->extra->name              = $row["Field"];
                $_TableDefinition[$i]->extra->nameDisp          = $row["Field"] . "-> " . $row["Type"];
                $_TableDefinition[$i]->extra->primary_key       = false;
                if ($row["Key"] == "PRI") {
                    $_TableDefinition[$i]->extra->primary_key   = true;
                }
                $_TableDefinition[$i]->extra->null              = true;
                if ($row["Null"] == "NO") {
                    $_TableDefinition[$i]->extra->null          = false;
                }
                //------------------------------------------------------------------
                $_TableDefinition[$i]->extra->extra             = $row["Extra"];
                preg_match('/^([^ (]+)(\((.+)\))?([ ](.+))?$/u', $row['Type'], $f);
                $F = strtoupper($f[1]);
                //------------------------------------------------------------------
                if ($F == "TINYINT" or $F == "SMALLINT" or $F == "MEDIUMINT" or $F == "INT" or $F == "BIGINT" or $F == "DECIMAL" or $F == "FLOAT") {
                    $_TableDefinition[$i]->extra->numeric = true;
                } else {
                    $_TableDefinition[$i]->extra->numeric = false;
                }
                //------------------------------------------------------------------
                if (isset($f[3])) {
                    if (strpos($f[3], ",") === false) {
                        $_TableDefinition[$i]->extra->max_length    = $f[3];
                        $_TableDefinition[$i]->extra->decimal       = 0;
                    } else {
                        $aux = explode(",", $f[3]);
                        $_TableDefinition[$i]->extra->max_length    = $aux[0];
                        $_TableDefinition[$i]->extra->decimal       = $aux[1];
                    }
                } else {
                    $_TableDefinition[$i]->extra->max_length        = 6;
                    $_TableDefinition[$i]->extra->decimal           = 0;
                }
                //------------------------------------------------------------------
                $_TableDefinition[$i]->extra->type                  = $f[1];
                //------------------------------------------------------------------
            }
            $i++;
            //------------------------------------------------------------------
        }
        //----------------------------------------------------------------------
        $db->rollback();
        return $_TableDefinition;
        
    }
    //put your code here
}

?>
