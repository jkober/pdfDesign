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
        //$db=$this->db;
        $db=PhpGenPdfDb::getConexion();
        if (trim($json->bdName) != "") {
            //$db->exec("use " . $json->bdName);
            $db->ejecute("use " . $json->bdName);
        }
        //----------------------------------------------------------------------
        //$db->BEGIN();
        $db->beginTransaction();
        //----------------------------------------------------------------------
        if (is_array($json->extras)) {
            foreach ($json->extras as $v) {
                $json->ssql = str_replace("{" . $v->name . "}", $v->value, $json->ssql);
            }
        }
        //----------------------------------------------------------------------
        // aca falta agregar los parametros extras para que sean reemplazados
        $sqlTempo = "create temporary table veoEstruc {$json->ssql}";
        $db->ejecute($sqlTempo);
        //$db->executeQuery($sqlTempo);
        //----------------------------------------------------------------------
        $recordSet          = $db->query("SHOW FIELDS FROM veoEstruc ");
        //$recordSet          = $db->executeQuery("SHOW FIELDS FROM veoEstruc ");
        //----------------------------------------------------------------------
        $_TableDefinition   = "";
        $i                  = 0;
        //----------------------------------------------------------------------
        while ($row = $recordSet->fetch()) {
            $_TableDefinition[$i] = (Object) array();
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
